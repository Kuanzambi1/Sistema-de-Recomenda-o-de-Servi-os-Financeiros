const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Verificar token JWT
const autenticar = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ erro: 'Token de acesso em falta.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar se utilizador ainda existe e está ativo
    const { rows } = await query(
      'SELECT id, nome, email, tipo, ativo FROM utilizadores WHERE id = $1',
      [payload.id]
    );

    if (!rows.length || !rows[0].ativo) {
      return res.status(401).json({ erro: 'Utilizador inválido ou desactivado.' });
    }

    req.utilizador = rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ erro: 'Token expirado. Faça login novamente.' });
    }
    return res.status(403).json({ erro: 'Token inválido.' });
  }
};

// Autorização por tipo de utilizador
const autorizar = (...tipos) => (req, res, next) => {
  if (!tipos.includes(req.utilizador.tipo)) {
    return res.status(403).json({
      erro: `Acesso negado. Requer perfil: ${tipos.join(' ou ')}.`
    });
  }
  next();
};

module.exports = { autenticar, autorizar };
