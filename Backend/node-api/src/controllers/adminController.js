const axios  = require('axios');
const { query } = require('../config/database');
const riscoStore = require('../config/riscoStore');

const ML_URL = () => process.env.ML_SERVICE_URL || 'http://localhost:8000';

// GET /api/admin/metricas
const metricas = async (req, res, next) => {
  try {
    const [utilizadores, servicos, recomendacoes, feedbacks, modelo] = await Promise.all([
      query('SELECT COUNT(*)::int AS total, tipo FROM utilizadores GROUP BY tipo'),
      query('SELECT COUNT(*)::int AS total, ativo FROM servicos_financeiros GROUP BY ativo'),
      query(`SELECT COUNT(*)::int AS total,
               COUNT(*) FILTER (WHERE aceite = TRUE)::int  AS aceites,
               COUNT(*) FILTER (WHERE aceite = FALSE)::int AS rejeitadas,
               ROUND(AVG(probabilidade_adequacao)::numeric*100,2) AS media_adequacao_pct
             FROM recomendacoes`),
      query(`SELECT COUNT(*)::int AS total,
               ROUND(AVG(nota_likert)::numeric,2) AS media_nota
             FROM feedbacks`),
      query('SELECT * FROM modelos_preditivos WHERE ativo = TRUE ORDER BY criado_em DESC LIMIT 1'),
    ]);

    res.json({
      utilizadores: utilizadores.rows,
      servicos: servicos.rows,
      recomendacoes: recomendacoes.rows[0],
      feedbacks: feedbacks.rows[0],
      modelo_activo: modelo.rows[0] || null,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/modelo/retreinar
const retreinarModelo = async (req, res, next) => {
  try {
    // Verificar se há feedbacks suficientes (RN — mínimo 50)
    const { rows: [{ total }] } = await query('SELECT COUNT(*)::int AS total FROM feedbacks');
    if (total < 50) {
      return res.status(400).json({
        erro: `São necessários pelo menos 50 feedbacks para re-treinar. Actualmente: ${total}.`
      });
    }

    // Recolher dados de treino
    const { rows: dados } = await query(`
      SELECT
        pf.rendimento_mensal, pf.despesas_mensais, pf.dependentes,
        pf.nivel_educacao, pf.situacao_emprego, pf.tem_conta_bancaria,
        pf.tem_historico_credito, COALESCE(pf.score_credito,0) AS score_credito,
        pf.objetivo_financeiro, pf.capacidade_endividamento,
        sf.tipo AS tipo_servico, sf.taxa_juro_anual, sf.prazo_maximo_meses,
        sf.montante_maximo, sf.rendimento_minimo,
        CASE WHEN f.nota_likert >= 4 THEN 1 ELSE 0 END AS adequado
      FROM feedbacks f
      JOIN recomendacoes r ON r.id = f.recomendacao_id
      JOIN perfis_financeiros pf ON pf.id = r.perfil_financeiro_id
      JOIN servicos_financeiros sf ON sf.id = r.servico_financeiro_id
    `);

    // Enviar para serviço ML
    const mlResp = await axios.post(`${ML_URL()}/treinar`, {
      dados_treino: dados
    }, { timeout: 60000 });

    // Registar nova versão do modelo
    const novaVersao = mlResp.data.versao;
    const metricas   = mlResp.data.metricas;

    await query('UPDATE modelos_preditivos SET ativo = FALSE WHERE ativo = TRUE');

    await query(
      `INSERT INTO modelos_preditivos
         (versao, algoritmo, acuracia, precisao, recall, f1_score, auc_roc, amostras_treino, ativo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,TRUE)`,
      [novaVersao, 'regressao_logistica',
       metricas.acuracia, metricas.precisao, metricas.recall,
       metricas.f1_score, metricas.auc_roc, dados.length]
    );

    res.json({
      mensagem: `Modelo re-treinado com sucesso. Nova versão: ${novaVersao}`,
      metricas,
      amostras: dados.length
    });
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({ erro: 'Serviço ML indisponível.' });
    }
    next(err);
  }
};

// GET /api/admin/modelo/historico
const historicoModelos = async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT * FROM modelos_preditivos ORDER BY criado_em DESC'
    );
    res.json({ modelos: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/utilizadores
const listarUtilizadores = async (req, res, next) => {
  try {
    const { tipo } = req.query;
    const params = tipo ? [tipo] : [];
    const where  = tipo ? 'WHERE tipo = $1' : '';

    const { rows } = await query(
      `SELECT id, nome, email, tipo, ativo, criado_em FROM utilizadores
       ${where} ORDER BY criado_em DESC`,
      params
    );
    res.json({ utilizadores: rows });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/utilizadores
const criarUtilizador = async (req, res, next) => {
  try {
    const { nome, email, tipo } = req.body;
    
    const existe = await query('SELECT id FROM utilizadores WHERE email = $1', [email]);
    if (existe.rows.length) {
      return res.status(409).json({ erro: 'Email já registado.' });
    }

    // Default password for admin created users
    const bcrypt = require('bcryptjs');
    const password_hash = await bcrypt.hash('GeraD0rAuto!2026', 12);

    const { rows: [utilizador] } = await query(
      `INSERT INTO utilizadores (nome, email, password_hash, tipo)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, tipo, criado_em`,
      [nome, email.toLowerCase(), password_hash, tipo]
    );

    res.status(201).json({
      mensagem: 'Utilizador criado com sucesso.',
      utilizador,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/utilizadores/:id/ativo
const alternarAtivo = async (req, res, next) => {
  try {
    const { ativo } = req.body;

    if (req.params.id === req.utilizador.id && ativo === false) {
      return res.status(400).json({ erro: 'Não é possível bloquear a sua própria conta.' });
    }

    const { rows: [utilizador] } = await query(
      `UPDATE utilizadores SET ativo = $1 WHERE id = $2
       RETURNING id, nome, email, tipo, ativo, criado_em`,
      [ativo, req.params.id]
    );

    if (!utilizador) {
      return res.status(404).json({ erro: 'Utilizador não encontrado.' });
    }

    res.json({
      mensagem: ativo ? 'Utilizador activado.' : 'Utilizador bloqueado.',
      utilizador,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/utilizadores/:id
const obterUtilizador = async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT id, nome, email, tipo, ativo, criado_em FROM utilizadores WHERE id = $1',
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ erro: 'Utilizador não encontrado.' });
    }

    res.json({ utilizador: rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/utilizadores/:id
const actualizarUtilizador = async (req, res, next) => {
  try {
    const { nome, email, tipo } = req.body;

    const campos = [];
    const valores = [];
    let idx = 1;

    if (nome !== undefined) {
      campos.push(`nome = $${idx++}`);
      valores.push(String(nome).trim());
    }
    if (email !== undefined) {
      campos.push(`email = $${idx++}`);
      valores.push(String(email).toLowerCase().trim());
    }
    if (tipo !== undefined) {
      campos.push(`tipo = $${idx++}`);
      valores.push(tipo);
    }

    if (!campos.length) {
      return res.status(400).json({ erro: 'Nenhum campo para actualizar.' });
    }

    valores.push(req.params.id);

    const { rows: [utilizador] } = await query(
      `UPDATE utilizadores SET ${campos.join(', ')} WHERE id = $${idx}
       RETURNING id, nome, email, tipo, ativo, criado_em`,
      valores
    );

    if (!utilizador) {
      return res.status(404).json({ erro: 'Utilizador não encontrado.' });
    }

    res.json({ mensagem: 'Utilizador actualizado.', utilizador });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/utilizadores/:id
const eliminarUtilizador = async (req, res, next) => {
  try {
    if (req.params.id === req.utilizador.id) {
      return res.status(400).json({ erro: 'Não é possível eliminar a sua própria conta.' });
    }

    const { rows: [utilizador] } = await query(
      'DELETE FROM utilizadores WHERE id = $1 RETURNING id, nome, email',
      [req.params.id]
    );

    if (!utilizador) {
      return res.status(404).json({ erro: 'Utilizador não encontrado.' });
    }

    res.json({ mensagem: 'Utilizador eliminado.', utilizador });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/servicos — listagem global (todos os estados e provedores)
const listarServicos = async (req, res, next) => {
  try {
    const { estado, tipo, q, pagina = 1, limite = 20 } = req.query;
    const offset = (parseInt(pagina) - 1) * parseInt(limite);

    const condicoes = [];
    const params = [];
    let idx = 1;

    if (estado) {
      condicoes.push(`sf.estado = $${idx++}`);
      params.push(estado);
    }
    if (tipo) {
      condicoes.push(`sf.tipo = $${idx++}`);
      params.push(tipo);
    }
    if (q) {
      condicoes.push(`(sf.nome ILIKE $${idx++} OR u.nome ILIKE $${idx++})`);
      params.push(`%${q}%`, `%${q}%`);
    }

    const where = condicoes.length ? 'WHERE ' + condicoes.join(' AND ') : '';

    params.push(parseInt(limite), offset);

    const { rows: servicos } = await query(
      `SELECT sf.*, u.nome AS nome_provedor,
              CASE
                WHEN sf.descricao IS NOT NULL AND sf.descricao <> '' THEN 1 ELSE 0 END
              + CASE WHEN sf.montante_maximo IS NOT NULL THEN 1 ELSE 0 END
              + CASE WHEN sf.prazo_maximo_meses > sf.prazo_minimo_meses THEN 1 ELSE 0 END
              + CASE WHEN sf.rendimento_minimo IS NOT NULL THEN 1 ELSE 0 END
              + CASE WHEN sf.score_credito_minimo IS NOT NULL THEN 1 ELSE 0 END AS score_auditoria
       FROM servicos_financeiros sf
       JOIN utilizadores u ON u.id = sf.provedor_id
       ${where}
       ORDER BY
         CASE sf.estado WHEN 'pendente' THEN 0 ELSE 1 END,
         sf.nome
       LIMIT $${idx++} OFFSET $${idx}`,
      params
    );

    // score_auditoria vem em 0..5 → normalizar para 0..100
    const normalizados = servicos.map(s => ({
      ...s,
      score_auditoria: Math.round((s.score_auditoria / 5) * 100),
    }));

    const { rows: [{ total }] } = await query(
      `SELECT COUNT(*) AS total FROM servicos_financeiros sf ${where}`,
      params.slice(0, -2)
    );

    res.json({
      servicos: normalizados,
      paginacao: {
        total: parseInt(total),
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        paginas: Math.ceil(total / limite)
      }
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/servicos/:id/estado — fluxo de aprovação/supervisão
const aplicarEstadoServico = async (req, res, next) => {
  try {
    const { estado } = req.body;

    const valido = ['pendente', 'ativo', 'pausado', 'suspenso'].includes(estado);
    if (!valido) {
      return res.status(400).json({ erro: 'Estado inválido.' });
    }

    const ativo = estado === 'ativo';
    const { rows: [servico] } = await query(
      `UPDATE servicos_financeiros
       SET estado = $1, ativo = $2, atualizado_em = NOW()
       WHERE id = $3
       RETURNING *`,
      [estado, ativo, req.params.id]
    );

    if (!servico) {
      return res.status(404).json({ erro: 'Serviço não encontrado.' });
    }

    const mensagens = {
      ativo:    'Serviço aprovado e activado.',
      pendente: 'Serviço marcado como pendente.',
      pausado:  'Serviço pausado.',
      suspenso: 'Serviço suspenso.',
    };

    res.json({ mensagem: mensagens[estado], servico });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/auditoria — feed de atividade derivado da BD (sem tabela própria)
const listarAuditoria = async (req, res, next) => {
  try {
    const { rows: eventos } = await query(`
      SELECT * FROM (
        SELECT 'CRIACAO_UTILIZADOR' AS acao,
               u.criado_em AS ocorrido_em,
               u.email AS ator,
               u.nome AS alvo,
               'Novo utilizador registado (' || u.tipo || ')' AS detalhes,
               'baixa' AS severidade
        FROM utilizadores u

        UNION ALL

        SELECT 'CRIACAO_SERVICO',
               s.criado_em,
               p.nome,
               s.nome,
               'Serviço criado (' || s.tipo || ') — estado: ' || s.estado,
               CASE WHEN s.estado = 'pendente' THEN 'media' ELSE 'baixa' END
        FROM servicos_financeiros s
        JOIN utilizadores p ON p.id = s.provedor_id

        UNION ALL

        SELECT 'ATUALIZACAO_SERVICO',
               s.atualizado_em,
               p.nome,
               s.nome,
               'Serviço actualizado — estado: ' || s.estado || ', activo: ' || s.ativo,
               'baixa'
        FROM servicos_financeiros s
        JOIN utilizadores p ON p.id = s.provedor_id
        WHERE s.atualizado_em > s.criado_em

        UNION ALL

        SELECT 'RECOMENDACAO_GERADA',
               r.criado_em,
               u.nome,
               s.nome,
               'Recomendação gerada — adequação ' ||
                 ROUND((r.probabilidade_adequacao * 100)::numeric, 1) || '%',
               'baixa'
        FROM recomendacoes r
        JOIN utilizadores u ON u.id = r.utilizador_id
        JOIN servicos_financeiros s ON s.id = r.servico_financeiro_id

        UNION ALL

        SELECT 'FEEDBACK_SUBMETIDO',
               f.criado_em,
               u.nome,
               'recomendação ' || LEFT(r.id::text, 8),
               'Avaliação ' || f.nota_likert || '/5 na escala Likert',
               CASE WHEN f.nota_likert >= 4 THEN 'baixa' WHEN f.nota_likert = 3 THEN 'media' ELSE 'alta' END
        FROM feedbacks f
        JOIN utilizadores u ON u.id = f.utilizador_id
        JOIN recomendacoes r ON r.id = f.recomendacao_id

        UNION ALL

        SELECT 'RETREINO_MODELO',
               m.criado_em,
               'Sistema',
               m.versao,
               'Modelo ' || m.algoritmo || ' — acurácia ' ||
                 ROUND((COALESCE(m.acuracia,0) * 100)::numeric, 1) || '%, amostras: ' || m.amostras_treino,
               'alta'
        FROM modelos_preditivos m
      ) AS eventos
      ORDER BY ocorrido_em DESC
      LIMIT 100
    `);

    const lista = eventos.map((e, i) => ({
      id: i + 1,
      timestamp: e.ocorrido_em,
      ator: e.ator,
      acao: e.acao,
      alvo: e.alvo,
      detalhes: e.detalhes,
      severidade: e.severidade,
    }));

    res.json({ eventos: lista, total: lista.length });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/risco — configuração actual de pesos/regras do motor (fallback)
const obterRisco = async (req, res, next) => {
  try {
    res.json({ config: riscoStore.carregar() });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/risco — actualizar pesos/regras (persistência em ficheiro)
const actualizarRisco = async (req, res, next) => {
  try {
    const { pesos, regras } = req.body;

    const actual = riscoStore.carregar();
    const novosPesos = { ...actual.pesos, ...(pesos || {}) };
    const novasRegras = { ...actual.regras, ...(regras || {}) };

    // Validar pesos inteiros 0..100
    for (const [chave, valor] of Object.entries(novosPesos)) {
      if (!Number.isInteger(valor) || valor < 0 || valor > 100) {
        return res.status(400).json({
          erro: `Peso "${chave}" deve ser um inteiro entre 0 e 100.`
        });
      }
    }

    const total = Object.values(novosPesos).reduce((acc, v) => acc + v, 0);
    if (total > 100) {
      return res.status(400).json({
        erro: `A soma dos pesos (${total}%) não pode exceder 100%.`
      });
    }

    // Regras
    for (const [chave, valor] of Object.entries(novasRegras)) {
      if (!Number.isInteger(valor) || valor <= 0) {
        return res.status(400).json({
          erro: `Regra "${chave}" deve ser um inteiro positivo.`
        });
      }
    }

    const config = { pesos: novosPesos, regras: novasRegras };
    riscoStore.salvar(config);

    res.json({ mensagem: 'Configuração de risco actualizada.', config });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  metricas, retreinarModelo, historicoModelos,
  listarUtilizadores, criarUtilizador, alternarAtivo,
  obterUtilizador, actualizarUtilizador, eliminarUtilizador,
  listarServicos, aplicarEstadoServico,
  listarAuditoria, obterRisco, actualizarRisco,
};
