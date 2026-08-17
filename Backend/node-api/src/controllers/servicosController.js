const { query } = require('../config/database');

// GET /api/servicos
const listar = async (req, res, next) => {
  try {
    const { tipo, provedor_id, pagina = 1, limite = 20 } = req.query;
    const offset = (pagina - 1) * limite;

    const condicoes = [];
    const params = [];
    let idx = 1;

    // Catálogo público: só serviços aprovados e activos.
    // Gestão (provedor_id fornecido): inclui todos os estados do próprio provedor.
    if (!provedor_id) {
      condicoes.push('sf.ativo = TRUE');
    }
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

    // Aprovação: admins criam serviços activos; provedores ficam "pendente"
    // até aprovação do administrador.
    const admin                 = req.utilizador.tipo === 'administrador';
    const estado                = admin ? 'ativo' : 'pendente';
    const ativo                 = admin ? true : false;

    const { rows: [servico] } = await query(
      `INSERT INTO servicos_financeiros
         (provedor_id, nome, tipo, descricao, taxa_juro_anual,
          prazo_minimo_meses, prazo_maximo_meses, montante_minimo,
          montante_maximo, rendimento_minimo, score_credito_minimo,
          requer_conta_bancaria, estado, ativo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING *`,
      [provedor_id, nome, tipo, descricao, taxa_juro_anual,
       prazo_minimo_meses, prazo_maximo_meses, montante_minimo,
       montante_maximo, rendimento_minimo, score_credito_minimo,
       requer_conta_bancaria, estado, ativo]
    );

    res.status(201).json({
      mensagem: admin
        ? 'Serviço criado com sucesso.'
        : 'Serviço criado. Aguarda aprovação do administrador.',
      servico
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/servicos/:id
const actualizar = async (req, res, next) => {
  try {
    const ehAdmin = req.utilizador.tipo === 'administrador';

    const campos = [
      'nome','tipo','descricao','taxa_juro_anual','prazo_minimo_meses',
      'prazo_maximo_meses','montante_minimo','montante_maximo',
      'rendimento_minimo','score_credito_minimo','requer_conta_bancaria'
    ];

    // Admin pode ainda gerir estado/activação diretamente.
    if (ehAdmin) {
      if (req.body.estado !== undefined) campos.push('estado');
      if (req.body.ativo !== undefined) campos.push('ativo');
    }

    const updates = [];
    const valores = [];
    let idx = 1;

    for (const c of campos) {
      if (req.body[c] !== undefined) {
        updates.push(`${c} = $${idx++}`);
        valores.push(req.body[c]);
      }
    }

    // Provedores: só podem pausar/retomar os seus próprios serviços — nunca
    // aprovar (pendente → ativo) nem reverter uma suspensão.
    let estadoTarget = null;
    let ativoTarget = null;
    if (!ehAdmin && req.body.ativo !== undefined) {
      const { rows: [actual] } = await query(
        'SELECT estado FROM servicos_financeiros WHERE id = $1 AND provedor_id = $2',
        [req.params.id, req.utilizador.id]
      );
      if (!actual) {
        return res.status(404).json({ erro: 'Serviço não encontrado ou sem permissão.' });
      }
      if (req.body.ativo === true) {
        if (actual.estado === 'pendente') {
          return res.status(403).json({ erro: 'Serviço aguarda aprovação do administrador.' });
        }
        if (actual.estado === 'suspenso') {
          return res.status(403).json({ erro: 'Serviço suspenso pelo administrador.' });
        }
        estadoTarget = 'ativo';
      } else {
        estadoTarget = 'pausado';
      }
      ativoTarget = req.body.ativo;
    }

    if (!updates.length && estadoTarget === null) {
      return res.status(400).json({ erro: 'Nenhum campo para actualizar.' });
    }

    const temUpdates = updates.length > 0;
    let servico;
    if (temUpdates) {
      valores.push(req.params.id);
      let whereExtra = '';
      const idxId = idx;
      if (!ehAdmin) {
        whereExtra = ` AND provedor_id = $${idxId + 1}`;
        valores.push(req.utilizador.id);
      }
      const { rows: [row] } = await query(
        `UPDATE servicos_financeiros SET ${updates.join(', ')}
         WHERE id = $${idxId}${whereExtra}
         RETURNING *`,
        valores
      );
      if (!row) return res.status(404).json({ erro: 'Serviço não encontrado ou sem permissão.' });
      servico = row;
    } else {
      const { rows: [row] } = await query(
        'SELECT * FROM servicos_financeiros WHERE id = $1 AND provedor_id = $2',
        [req.params.id, req.utilizador.id]
      );
      if (!row) return res.status(404).json({ erro: 'Serviço não encontrado ou sem permissão.' });
      servico = row;
    }

    // Sincronizar estado/activação quando alterados (admin ou pausa/retoma do provedor)
    let estadoFinal = null;
    let ativoFinal = null;
    if (ehAdmin) {
      if (req.body.estado !== undefined) {
        estadoFinal = req.body.estado;
      } else if (req.body.ativo !== undefined) {
        estadoFinal = req.body.ativo === true ? 'ativo' : 'pendente';
      }
      if (estadoFinal !== null) ativoFinal = estadoFinal === 'ativo';
    } else if (estadoTarget !== null) {
      estadoFinal = estadoTarget;
      ativoFinal = ativoTarget;
    }

    if (estadoFinal !== null) {
      const { rows: [sync] } = await query(
        `UPDATE servicos_financeiros SET estado = $1, ativo = $2, atualizado_em = NOW()
         WHERE id = $3 RETURNING *`,
        [estadoFinal, ativoFinal, servico.id]
      );
      if (sync) servico = sync;
    }

    res.json({ mensagem: 'Serviço actualizado.', servico });
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, obter, criar, actualizar };
