const { describe, it } = require('node:test');
const assert = require('node:assert');
const { errorHandler, validar } = require('./errorHandler');

describe('errorHandler', () => {
  it('deve tratar erro 23505 (duplicado) com status 409', (t) => {
    let statusCode;
    let jsonBody;

    const err = { code: '23505', message: 'duplicate key' };
    const req = {};
    const res = {
      status: (code) => {
        statusCode = code;
        return { json: (body) => { jsonBody = body; } };
      },
    };

    errorHandler(err, req, res, () => {});

    assert.strictEqual(statusCode, 409);
    assert.strictEqual(jsonBody.erro, 'Registo duplicado. O recurso já existe.');
  });

  it('deve tratar erro 23503 (FK violada) com status 400', (t) => {
    let statusCode;
    let jsonBody;

    const err = { code: '23503', message: 'foreign key violation' };
    const req = {};
    const res = {
      status: (code) => {
        statusCode = code;
        return { json: (body) => { jsonBody = body; } };
      },
    };

    errorHandler(err, req, res, () => {});

    assert.strictEqual(statusCode, 400);
    assert.strictEqual(jsonBody.erro, 'Referência inválida — registo relacionado não encontrado.');
  });

  it('deve tratar erro 23514 (check violation) com status 400', (t) => {
    let statusCode;
    let jsonBody;

    const err = { code: '23514', message: 'check constraint violation' };
    const req = {};
    const res = {
      status: (code) => {
        statusCode = code;
        return { json: (body) => { jsonBody = body; } };
      },
    };

    errorHandler(err, req, res, () => {});

    assert.strictEqual(statusCode, 400);
    assert.strictEqual(jsonBody.erro, 'Dados inválidos — violação de regra de negócio.');
  });

  it('deve tratar erro genérico com status 500', (t) => {
    let statusCode;
    let jsonBody;

    const err = new Error('Algo correu mal');
    const req = {};
    const res = {
      status: (code) => {
        statusCode = code;
        return { json: (body) => { jsonBody = body; } };
      },
    };

    errorHandler(err, req, res, () => {});

    assert.strictEqual(statusCode, 500);
    assert.strictEqual(jsonBody.erro, 'Erro interno do servidor.');
  });

  it('deve incluir stack trace em development', (t) => {
    let jsonBody;
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const err = new Error('test stack');
    const req = {};
    const res = {
      status: () => ({ json: (body) => { jsonBody = body; } }),
    };

    errorHandler(err, req, res, () => {});
    assert.ok(jsonBody.detalhe);

    process.env.NODE_ENV = origEnv;
  });
});
