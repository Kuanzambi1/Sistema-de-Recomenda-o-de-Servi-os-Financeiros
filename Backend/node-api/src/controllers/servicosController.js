const { query } = require('../config/database');

// GET /api/servicos
const listar = async (req, res, next) => {
  try {
    const { tipo, provedor_id, pagina = 1, limite = 20 } = req.query;
    const offset = (pagina - 1) * limite;

    const condicoes = ['sf.ativo = TRUE'];
    const params = [];
    let idx = 1;

    if (tipo) {
      condicoes.push(`sf.tipo = $${idx++}`);
      params.push(tipo);
    }
    if (provedor_id) {
      condicoes.push(`sf.provedor_id = $${idx++}`);
      params.push(provedor_id);
    }

    const where = condicoes.length ? 'WHERE ' + condicoes.join(' AND ') : '';

    params.push(parseInt(limite), offset);

    const { rows: servicos } = await query(
      `SELECT sf.*, u.nome AS nome_provedor
       FROM servicos_financeiros sf
       JOIN utilizadores u ON u.id = sf.provedor_id
       ${where}
       ORDER BY sf.nome
       LIMIT $${idx++} OFFSET $${idx}`,
      params
    );

    const { rows: [{ total }] } = await query(
      `SELECT COUNT(*) AS total FROM servicos_financeiros sf ${where}`,
      params.slice(0, -2)
    );

    res.json({
      servicos,
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

// GET /api/servicos/:id
const obter = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT sf.*, u.nome AS nome_provedor
       FROM servicos_financeiros sf
       JOIN utilizadores u ON u.id = sf.provedor_id
       WHERE sf.id = $1`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ erro: 'Serviço não encontrado.' });
    }

    res.json({ servico: rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST /api/servicos (apenas provedor/admin)
const criar = async (req, res, next) => {
  try {
    const {
      nome, tipo, descricao, taxa_juro_anual,
      prazo_minimo_meses, prazo_maximo_meses,
      montante_minimo, montante_maximo,
      rendimento_minimo = 0, score_credito_minimo = 0,
      requer_conta_bancaria = false
    } = req.body;

    const provedor_id = req.utilizador.tipo === 'administrador'
      ? (req.body.provedor_id || req.utilizador.id)
      : req.utilizador.id;

    const { rows: [servico] } = await query(
      `INSERT INTO servicos_financeiros
         (provedor_id, nome, tipo, descricao, taxa_juro_anual,
          prazo_minimo_meses, prazo_maximo_meses, montante_minimo,
          montante_maximo, rendimento_minimo, score_credito_minimo,
          requer_conta_bancaria)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [provedor_id, nome, tipo, descricao, taxa_juro_anual,
       prazo_minimo_meses, prazo_maximo_meses, montante_minimo,
       montante_maximo, rendimento_minimo, score_credito_minimo,
       requer_conta_bancaria]
    );

    res.status(201).json({ mensagem: 'Serviço criado com sucesso.', servico });
  } catch (err) {
    next(err);
  }
};

// PUT /api/servicos/:id
const actualizar = async (req, res, next) => {
  try {
    const campos = [
      'nome','tipo','descricao','taxa_juro_anual','prazo_minimo_meses',
      'prazo_maximo_meses','montante_minimo','montante_maximo',
      'rendimento_minimo','score_credito_minimo','requer_conta_bancaria','ativo'
    ];

    const updates = [];
    const valores = [];
    let idx = 1;

    for (const c of campos) {
      if (req.body[c] !== undefined) {
        updates.push(`${c} = $${idx++}`);
        valores.push(req.body[c]);
      }
    }

    if (!updates.length) return res.status(400).json({ erro: 'Nenhum campo para actualizar.' });

    valores.push(req.params.id);

    // Provedores só podem editar os seus próprios serviços
    let whereExtra = '';
    if (req.utilizador.tipo === 'provedor') {
      whereExtra = ` AND provedor_id = $${++idx}`;
      valores.push(req.utilizador.id);
    }

    const { rows: [servico] } = await query(
      `UPDATE servicos_financeiros SET ${updates.join(', ')}
       WHERE id = $${idx - (req.utilizador.tipo === 'provedor' ? 1 : 0)}${whereExtra}
       RETURNING *`,
      valores
    );

    if (!servico) return res.status(404).json({ erro: 'Serviço não encontrado ou sem permissão.' });

    res.json({ mensagem: 'Serviço actualizado.', servico });
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, obter, criar, actualizar };
