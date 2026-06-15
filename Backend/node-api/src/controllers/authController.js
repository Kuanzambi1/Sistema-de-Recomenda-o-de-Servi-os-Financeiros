const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { query } = require('../config/database');

// POST /api/auth/registar
const registar = async (req, res, next) => {
  try {
    const { nome, email, password, tipo = 'utilizador' } = req.body;

    // Verificar se email já existe
    const existe = await query('SELECT id FROM utilizadores WHERE email = $1', [email]);
    if (existe.rows.length) {
      return res.status(409).json({ erro: 'Email já registado.' });
    }

    // Impedir criação de administradores via API pública
    if (tipo === 'administrador') {
      return res.status(403).json({ erro: 'Não é permitido registar administradores.' });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const { rows: [utilizador] } = await query(
      `INSERT INTO utilizadores (nome, email, password_hash, tipo)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, tipo, criado_em`,
      [nome, email.toLowerCase(), password_hash, tipo]
    );

    const token = gerarToken(utilizador);

    res.status(201).json({
      mensagem: 'Utilizador registado com sucesso.',
      token,
      utilizador,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { rows } = await query(
      'SELECT id, nome, email, tipo, password_hash, ativo FROM utilizadores WHERE email = $1',
      [email.toLowerCase()]
    );

    if (!rows.length) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const utilizador = rows[0];

    if (!utilizador.ativo) {
      return res.status(401).json({ erro: 'Conta desactivada. Contacte o suporte.' });
    }

    const passwordValida = await bcrypt.compare(password, utilizador.password_hash);
    if (!passwordValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const token = gerarToken(utilizador);
    const { password_hash, ...dadosPublicos } = utilizador;

    res.json({
      mensagem: 'Login efectuado com sucesso.',
      token,
      utilizador: dadosPublicos,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/perfil
const obterPerfil = async (req, res) => {
  res.json({ utilizador: req.utilizador });
};

// POST /api/auth/alterar-password
const alterarPassword = async (req, res, next) => {
  try {
    const { password_atual, password_nova } = req.body;

    const { rows } = await query(
      'SELECT password_hash FROM utilizadores WHERE id = $1',
      [req.utilizador.id]
    );

    const valida = await bcrypt.compare(password_atual, rows[0].password_hash);
    if (!valida) {
      return res.status(401).json({ erro: 'Password actual incorrecta.' });
    }

    const novo_hash = await bcrypt.hash(password_nova, 12);
    await query('UPDATE utilizadores SET password_hash = $1 WHERE id = $2',
      [novo_hash, req.utilizador.id]);

    res.json({ mensagem: 'Password alterada com sucesso.' });
  } catch (err) {
    next(err);
  }
};

const gerarToken = (utilizador) =>
  jwt.sign(
    { id: utilizador.id, email: utilizador.email, tipo: utilizador.tipo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

module.exports = { registar, login, obterPerfil, alterarPassword };
