"use strict";

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '../../config/risco.json');

// Pesos default — reflectem exactamente os incrementos reais da heurística
// de fallback em recomendacoesController (calcularHeuristica).
const DEFAULTS = {
  pesos: {
    rendimento:       20,
    historico_credito: 10,
    conta_bancaria:     5,
    score_alto:        15,
    score_medio:        8,
    seguro:             5,
    microcredito:      10,
  },
  regras: {
    max_recomendacoes:                10,
    limiar_minimo_probabilidade_pct:   5,
  },
};

let cache = null;

function carregar() {
  if (cache) return cache;

  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
    const parsed = JSON.parse(raw);

    // Garantir estrutura completa (mesmo que o ficheiro seja parcial)
    const config = {
      pesos: { ...DEFAULTS.pesos, ...(parsed.pesos || {}) },
      regras: { ...DEFAULTS.regras, ...(parsed.regras || {}) },
    };
    cache = config;
    return config;
  } catch {
    cache = DEFAULTS;
    return cache;
  }
}

function recarregar() {
  cache = null;
  return carregar();
}

function salvar(conf) {
  cache = conf;
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(conf, null, 2), 'utf8');
  return conf;
}

module.exports = { carregar, recarregar, salvar, DEFAULTS, CONFIG_PATH };