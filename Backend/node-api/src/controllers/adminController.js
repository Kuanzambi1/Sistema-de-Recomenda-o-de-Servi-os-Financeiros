const axios  = require('axios');
const { query } = require('../config/database');

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

module.exports = { metricas, retreinarModelo, historicoModelos, listarUtilizadores };
