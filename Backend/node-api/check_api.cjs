"use strict";
const adminCtrl = require("./src/controllers/adminController");

function fakeRes() {
  return {
    status(c) { this._s = c; return this; },
    json(payload) { this._p = payload; console.log("RES", this._s || 200, JSON.stringify(payload).slice(0, 300)); this._done = true; },
  };
}

(async () => {
  const req = { query: {}, body: {}, params: {}, utilizador: { id: "x", tipo: "administrador" } };
  const res = fakeRes();
  await adminCtrl.listarServicos(req, res, (e) => console.error("ERR", e.message));
  if (!res._done) { console.log("FIM listarServicos"); }

  const res2 = fakeRes();
  await adminCtrl.listarAuditoria(req, res2, (e) => console.error("ERR2", e.message));
  if (!res2._done) { console.log("FIM listarAuditoria"); }

  const res3 = fakeRes();
  await adminCtrl.obterRisco(req, res3, (e) => console.error("ERR3", e.message));

  const res4 = fakeRes();
  req.body = { estados: null };
  await adminCtrl.actualizarRisco(
    { body: { pesos: { rendimento: 22, historico_credito: 10, conta_bancaria: 5, score_alto: 15, score_medio: 8, seguro: 5, microcredito: 10 }, regras: { max_recomendacoes: 10, limiar_minimo_probabilidade_pct: 5 } }, utilizador: req.utilizador },
    res4,
    (e) => console.error("ERR4", e.message)
  );
  await adminCtrl.obterRisco(req, fakeRes(), (e) => console.error("ERR5", e.message));
  process.exit(0);
})().catch((e) => { console.error("FATAL", e); process.exit(1); });