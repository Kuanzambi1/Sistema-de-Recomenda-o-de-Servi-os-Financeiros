const { describe, it } = require('node:test');
const assert = require('node:assert');
const { autorizar } = require('./auth');

describe('Middleware de Autorização', () => {
  it('Deve chamar next() se o tipo de utilizador for permitido', (t) => {
    let nextCalled = false;
    const req = { utilizador: { tipo: 'administrador' } };
    const res = {};
    const next = () => { nextCalled = true; };

    const middleware = autorizar('administrador', 'suporte');
    middleware(req, res, next);

    assert.strictEqual(nextCalled, true);
  });

  it('Deve retornar 403 e mensagem de erro se o tipo for negado', (t) => {
    let statusCalled = null;
    let jsonCalled = null;

    const req = { utilizador: { tipo: 'utilizador' } };
    const res = {
      status: (code) => {
        statusCalled = code;
        return {
          json: (data) => { jsonCalled = data; }
        };
      }
    };
    const next = () => { throw new Error('Não deve ser chamado'); };

    const middleware = autorizar('administrador');
    middleware(req, res, next);

    assert.strictEqual(statusCalled, 403);
    assert.strictEqual(jsonCalled.erro, 'Acesso negado. Requer perfil: administrador.');
  });
});
