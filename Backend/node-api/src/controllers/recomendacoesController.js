const axios  = require('axios');
const { query, withTransaction } = require('../config/database');

const ML_URL = () => process.env.ML_SERVICE_URL || 'http://localhost:8000';

// POST /api/recomendacoes — gerar recomendações para o utilizador autenticado
const gerar = async (req, res, next) => {
  try {
    // 1. Obter perfil financeiro
    const { rows: perfis } = await query(
      'SELECT * FROM perfis_financeiros WHERE utilizador_id = $1',
      [req.utilizador.id]
    );

    if (!perfis.length) {
      return res.status(400).json({
        erro: 'Perfil financeiro não encontrado. Crie o seu perfil antes de pedir recomendações.'
      });
    }
    const perfil = perfis[0];

    // 2. Filtrar serviços elegíveis pelas regras de negócio (RN01–RN08)
    const { rows: servicos } = await query(
      `SELECT * FROM servicos_financeiros
       WHERE ativo = TRUE
         AND rendimento_minimo    <= $1
         AND (score_credito_minimo = 0 OR (score_credito_minimo <= COALESCE($2, 0)))
         AND (requer_conta_bancaria = FALSE OR $3 = TRUE)
         AND ($4::numeric IS NULL OR montante_minimo <= $4)
       ORDER BY nome`,
      [
        perfil.rendimento_mensal,
        perfil.score_credito,
        perfil.tem_conta_bancaria,
        req.body.montante_pretendido || null
      ]
    );

    if (!servicos.length) {
      return res.status(200).json({
        mensagem: 'Nenhum serviço elegível encontrado para o seu perfil actual.',
        recomendacoes: []
      });
    }

    // 3. Chamar serviço ML para calcular probabilidades
    let probabilidades;
    try {
      const mlResp = await axios.post(`${ML_URL()}/prever`, {
        perfil: {
          rendimento_mensal:     parseFloat(perfil.rendimento_mensal),
          despesas_mensais:      parseFloat(perfil.despesas_mensais),
          dependentes:           perfil.dependentes,
          nivel_educacao:        perfil.nivel_educacao,
          situacao_emprego:      perfil.situacao_emprego,
          tem_conta_bancaria:    perfil.tem_conta_bancaria,
          tem_historico_credito: perfil.tem_historico_credito,
          score_credito:         perfil.score_credito || 0,
          objetivo_financeiro:   perfil.objetivo_financeiro,
          capacidade_endividamento: parseFloat(perfil.capacidade_endividamento)
        },
        servicos: servicos.map(s => ({
          id:              s.id,
          tipo:            s.tipo,
          taxa_juro_anual: parseFloat(s.taxa_juro_anual) || 0,
          prazo_max_meses: s.prazo_maximo_meses,
          montante_max:    parseFloat(s.montante_maximo) || 0,
          rendimento_min:  parseFloat(s.rendimento_minimo)
        }))
      }, { timeout: 10000 });

      probabilidades = mlResp.data.probabilidades; // { servico_id: prob }
    } catch (mlErr) {
      console.warn('[ML] Serviço ML indisponível — a usar heurística de fallback.');
      probabilidades = calcularHeuristica(perfil, servicos);
    }

    // 4. Ordenar e guardar recomendações
    const ranked = servicos
      .map(s => ({ ...s, probabilidade: probabilidades[s.id] || 0 }))
      .sort((a, b) => b.probabilidade - a.probabilidade)
      .slice(0, 10); // máx 10 recomendações (RN10)

    const recomendacoesGuardadas = await withTransaction(async (client) => {
      // Apagar recomendações anteriores não vistas
      await client.query(
        `DELETE FROM recomendacoes
         WHERE utilizador_id = $1 AND visualizada = FALSE`,
        [req.utilizador.id]
      );

      const inseridas = [];
      for (let i = 0; i < ranked.length; i++) {
        const s = ranked[i];
        const explicacao = gerarExplicacao(perfil, s, s.probabilidade);
        const { rows: [rec] } = await client.query(
          `INSERT INTO recomendacoes
             (utilizador_id, perfil_financeiro_id, servico_financeiro_id,
              probabilidade_adequacao, posicao_ranking, explicacao)
           VALUES ($1,$2,$3,$4,$5,$6)
           RETURNING *`,
          [req.utilizador.id, perfil.id, s.id,
           s.probabilidade, i + 1, explicacao]
        );
        inseridas.push({ ...rec, servico: s });
      }
      return inseridas;
    });

    res.status(201).json({
      mensagem: `${recomendacoesGuardadas.length} recomendações geradas.`,
      recomendacoes: recomendacoesGuardadas
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/recomendacoes — listar recomendações do utilizador
const listar = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT r.*, sf.nome AS nome_servico, sf.tipo AS tipo_servico,
              sf.taxa_juro_anual, sf.prazo_maximo_meses,
              u.nome AS nome_provedor
       FROM recomendacoes r
       JOIN servicos_financeiros sf ON sf.id = r.servico_financeiro_id
       JOIN utilizadores u ON u.id = sf.provedor_id
       WHERE r.utilizador_id = $1
       ORDER BY r.posicao_ranking
       LIMIT 10`,
      [req.utilizador.id]
    );

    // Marcar como visualizadas
    await query(
      `UPDATE recomendacoes SET visualizada = TRUE
       WHERE utilizador_id = $1 AND visualizada = FALSE`,
      [req.utilizador.id]
    );

    res.json({ recomendacoes: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/recomendacoes/:id
const obter = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT r.*, sf.*, u.nome AS nome_provedor
       FROM recomendacoes r
       JOIN servicos_financeiros sf ON sf.id = r.servico_financeiro_id
       JOIN utilizadores u ON u.id = sf.provedor_id
       WHERE r.id = $1 AND r.utilizador_id = $2`,
      [req.params.id, req.utilizador.id]
    );

    if (!rows.length) return res.status(404).json({ erro: 'Recomendação não encontrada.' });

    res.json({ recomendacao: rows[0] });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/recomendacoes/:id/aceitar
const registarDecisao = async (req, res, next) => {
  try {
    const { aceite } = req.body;

    const { rows: [rec] } = await query(
      `UPDATE recomendacoes SET aceite = $1
       WHERE id = $2 AND utilizador_id = $3
       RETURNING *`,
      [aceite, req.params.id, req.utilizador.id]
    );

    if (!rec) return res.status(404).json({ erro: 'Recomendação não encontrada.' });

    res.json({
      mensagem: aceite ? 'Recomendação aceite.' : 'Recomendação rejeitada.',
      recomendacao: rec
    });
  } catch (err) {
    next(err);
  }
};

// -----------------------------------------------
// Heurística de fallback quando ML está offline
// -----------------------------------------------
function calcularHeuristica(perfil, servicos) {
  const prob = {};
  const rendimento = parseFloat(perfil.rendimento_mensal);
  const capacidade = parseFloat(perfil.capacidade_endividamento);
  const temConta   = perfil.tem_conta_bancaria;
  const temHist    = perfil.tem_historico_credito;
  const score      = perfil.score_credito || 0;

  for (const s of servicos) {
    let p = 0.5;

    // Rácio rendimento / mínimo exigido
    const rMin = parseFloat(s.rendimento_minimo) || 1;
    p += Math.min((rendimento / rMin - 1) * 0.1, 0.2);

    // Histórico de crédito
    if (temHist) p += 0.1;
    if (temConta) p += 0.05;

    // Score de crédito
    if (score > 700) p += 0.15;
    else if (score > 500) p += 0.08;

    // Adequação ao tipo
    if (s.tipo.startsWith('seguro') && !temHist) p += 0.05;
    if (s.tipo === 'microcredito' && rendimento < 100000) p += 0.1;

    prob[s.id] = Math.max(0.05, Math.min(p, 0.99));
  }
  return prob;
}

// -----------------------------------------------
// Geração de explicação textual (XAI simples)
// -----------------------------------------------
function gerarExplicacao(perfil, servico, prob) {
  const pct   = (prob * 100).toFixed(1);
  const cap   = parseFloat(perfil.capacidade_endividamento).toLocaleString('pt-AO');
  const rend  = parseFloat(perfil.rendimento_mensal).toLocaleString('pt-AO');
  const razoes = [];

  if (perfil.tem_historico_credito) razoes.push('histórico de crédito positivo');
  if (perfil.tem_conta_bancaria)    razoes.push('conta bancária activa');
  if ((perfil.score_credito || 0) > 600) razoes.push(`score de crédito de ${perfil.score_credito}`);
  if (parseFloat(perfil.rendimento_mensal) > parseFloat(servico.rendimento_minimo) * 1.5)
    razoes.push(`rendimento mensal (${rend} Kz) acima do mínimo exigido`);

  const baseRazao = razoes.length
    ? `Com base no seu ${razoes.join(', ')}, `
    : 'Com base no seu perfil financeiro, ';

  return `${baseRazao}este serviço tem ${pct}% de adequação ao seu perfil. `
       + `A sua capacidade de endividamento estimada é de ${cap} Kz/mês, `
       + `compatível com este produto.`;
}

module.exports = { gerar, listar, obter, registarDecisao };
