const { query, withTransaction } = require('../config/database');

// GET /api/perfil
const obterPerfil = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT pf.*, u.nome, u.email
       FROM perfis_financeiros pf
       JOIN utilizadores u ON u.id = pf.utilizador_id
       WHERE pf.utilizador_id = $1`,
      [req.utilizador.id]
    );

    if (!rows.length) {
      return res.status(404).json({ erro: 'Perfil financeiro não encontrado. Crie o seu perfil primeiro.' });
    }

    res.json({ perfil: rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST /api/perfil
const criarPerfil = async (req, res, next) => {
  try {
    const {
      rendimento_mensal, despesas_mensais, dependentes = 0,
      nivel_educacao, situacao_emprego,
      tem_conta_bancaria = false, tem_historico_credito = false,
      score_credito, objetivo_financeiro = 'todos'
    } = req.body;

    // Verificar se já existe perfil
    const existente = await query(
      'SELECT id FROM perfis_financeiros WHERE utilizador_id = $1',
      [req.utilizador.id]
    );
    if (existente.rows.length) {
      return res.status(409).json({
        erro: 'Perfil já existe. Use PUT /api/perfil para actualizar.'
      });
    }

    const { rows: [perfil] } = await query(
      `INSERT INTO perfis_financeiros
         (utilizador_id, rendimento_mensal, despesas_mensais, dependentes,
          nivel_educacao, situacao_emprego, tem_conta_bancaria,
          tem_historico_credito, score_credito, objetivo_financeiro)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [req.utilizador.id, rendimento_mensal, despesas_mensais, dependentes,
       nivel_educacao, situacao_emprego, tem_conta_bancaria,
       tem_historico_credito, score_credito, objetivo_financeiro]
    );

    res.status(201).json({
      mensagem: 'Perfil financeiro criado com sucesso.',
      perfil
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/perfil
const actualizarPerfil = async (req, res, next) => {
  try {
    const campos = [
      'rendimento_mensal','despesas_mensais','dependentes','nivel_educacao',
      'situacao_emprego','tem_conta_bancaria','tem_historico_credito',
      'score_credito','objetivo_financeiro'
    ];

    const updates = [];
    const valores = [];
    let idx = 1;

    for (const campo of campos) {
      if (req.body[campo] !== undefined) {
        updates.push(`${campo} = $${idx++}`);
        valores.push(req.body[campo]);
      }
    }

    if (!updates.length) {
      return res.status(400).json({ erro: 'Nenhum campo para actualizar.' });
    }

    valores.push(req.utilizador.id);

    const { rows: [perfil] } = await query(
      `UPDATE perfis_financeiros
       SET ${updates.join(', ')}
       WHERE utilizador_id = $${idx}
       RETURNING *`,
      valores
    );

    if (!perfil) {
      return res.status(404).json({ erro: 'Perfil não encontrado.' });
    }

    res.json({ mensagem: 'Perfil actualizado.', perfil });
  } catch (err) {
    next(err);
  }
};

module.exports = { obterPerfil, criarPerfil, actualizarPerfil };
