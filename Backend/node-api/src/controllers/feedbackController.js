const { query } = require('../config/database');

// POST /api/feedbacks
const submeter = async (req, res, next) => {
  try {
    const { recomendacao_id, nota_likert, comentario, util } = req.body;

    // Verificar que a recomendação pertence ao utilizador
    const { rows: recs } = await query(
      'SELECT id FROM recomendacoes WHERE id = $1 AND utilizador_id = $2',
      [recomendacao_id, req.utilizador.id]
    );
    if (!recs.length) {
      return res.status(404).json({ erro: 'Recomendação não encontrada.' });
    }

    const { rows: [feedback] } = await query(
      `INSERT INTO feedbacks (utilizador_id, recomendacao_id, nota_likert, comentario, util)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [req.utilizador.id, recomendacao_id, nota_likert, comentario, util]
    );

    res.status(201).json({
      mensagem: 'Feedback registado. Obrigado pela sua avaliação.',
      feedback
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ erro: 'Já avaliou esta recomendação.' });
    }
    next(err);
  }
};

// GET /api/feedbacks/meus
const listarMeus = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT f.*, r.posicao_ranking, sf.nome AS nome_servico
       FROM feedbacks f
       JOIN recomendacoes r ON r.id = f.recomendacao_id
       JOIN servicos_financeiros sf ON sf.id = r.servico_financeiro_id
       WHERE f.utilizador_id = $1
       ORDER BY f.criado_em DESC`,
      [req.utilizador.id]
    );
    res.json({ feedbacks: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/feedbacks/estatisticas (admin)
const estatisticas = async (req, res, next) => {
  try {
    const { rows: [stats] } = await query(`
      SELECT
        COUNT(*)::int                        AS total,
        ROUND(AVG(nota_likert)::numeric, 2)  AS media_notas,
        COUNT(*) FILTER (WHERE nota_likert >= 4)::int AS positivos,
        COUNT(*) FILTER (WHERE nota_likert <= 2)::int AS negativos,
        COUNT(*) FILTER (WHERE util = TRUE)::int      AS uteis
      FROM feedbacks
    `);

    const { rows: porServico } = await query(`
      SELECT sf.nome AS servico, ROUND(AVG(f.nota_likert)::numeric,2) AS media,
             COUNT(f.id)::int AS total
      FROM feedbacks f
      JOIN recomendacoes r ON r.id = f.recomendacao_id
      JOIN servicos_financeiros sf ON sf.id = r.servico_financeiro_id
      GROUP BY sf.nome ORDER BY media DESC
    `);

    res.json({ estatisticas: stats, por_servico: porServico });
  } catch (err) {
    next(err);
  }
};

module.exports = { submeter, listarMeus, estatisticas };
