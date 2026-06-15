const { validationResult } = require('express-validator');

// Middleware de tratamento global de erros
const errorHandler = (err, req, res, next) => {
  console.error('[ERRO]', err.stack || err.message);

  // Erros de base de dados PostgreSQL
  if (err.code === '23505') {
    return res.status(409).json({ erro: 'Registo duplicado. O recurso já existe.' });
  }
  if (err.code === '23503') {
    return res.status(400).json({ erro: 'Referência inválida — registo relacionado não encontrado.' });
  }
  if (err.code === '23514') {
    return res.status(400).json({ erro: 'Dados inválidos — violação de regra de negócio.' });
  }

  // Erro genérico
  const status = err.status || 500;
  res.status(status).json({
    erro: status === 500 ? 'Erro interno do servidor.' : err.message,
    ...(process.env.NODE_ENV === 'development' && { detalhe: err.stack }),
  });
};

// Middleware de validação de campos (express-validator)
const validar = (req, res, next) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(422).json({
      erro: 'Dados inválidos.',
      campos: erros.array().map(e => ({ campo: e.path, mensagem: e.msg })),
    });
  }
  next();
};

module.exports = { errorHandler, validar };
