const path = require('path');

// Resolve modules from node-api folder
module.paths.unshift(path.join(__dirname, '../node-api/node_modules'));

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '../node-api/.env') });

const pool = new Pool({
  host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD,
});

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('🌱  A popular base de dados...');

    // Admin
    const adminHash = await bcrypt.hash('Admin@2025!', 12);
    const { rows: [admin] } = await client.query(`
      INSERT INTO utilizadores (nome, email, password_hash, tipo)
      VALUES ('Administrador SRFS', 'admin@srfs.ao', $1, 'administrador')
      ON CONFLICT (email) DO UPDATE SET nome = EXCLUDED.nome
      RETURNING id`, [adminHash]);

    // Provedores (bancos)
    const provedorHash = await bcrypt.hash('Banco@2025!', 12);
    const bancos = [
      { nome: 'Banco BIC Angola',                     email: 'bic@srfs.ao' },
      { nome: 'Banco Millennium BCP',                  email: 'bcp@srfs.ao' },
      { nome: 'Standard Bank Angola',                  email: 'stb@srfs.ao' },
      { nome: 'BAI — Banco Angolano de Investimentos', email: 'bai@srfs.ao' },
      { nome: 'BFA — Banco de Fomento Angola',         email: 'bfa@srfs.ao' },
      { nome: 'Banco Sol',                             email: 'sol@srfs.ao' },
      { nome: 'Banco Económico',                       email: 'eco@srfs.ao' },
      { nome: 'BNI — Banco de Negócios Internacional', email: 'bni@srfs.ao' },
    ];
    const provedorIds = [];
    for (const b of bancos) {
      const { rows: [p] } = await client.query(`
        INSERT INTO utilizadores (nome, email, password_hash, tipo)
        VALUES ($1, $2, $3, 'provedor')
        ON CONFLICT (email) DO UPDATE SET nome = EXCLUDED.nome
        RETURNING id`, [b.nome, b.email, provedorHash]);
      provedorIds.push(p.id);
    }

    // Utilizadores de teste
    const userHash = await bcrypt.hash('User@2025!', 12);
    const utilizadores = [
      { nome: 'Ana Joaquim',    email: 'ana@exemplo.ao',    rendimento: 150000, despesas: 80000,  dep: 2, edu: 'licenciatura', emp: 'empregado',  conta: true,  hist: true,  score: 650 },
      { nome: 'Carlos Teixeira', email: 'carlos@exemplo.ao', rendimento: 80000,  despesas: 60000,  dep: 0, edu: 'secundaria',   emp: 'autonomo',   conta: false, hist: false, score: null },
      { nome: 'Filomena Neto',   email: 'filomena@exemplo.ao',rendimento: 250000, despesas: 120000, dep: 3, edu: 'mestrado',     emp: 'empregado',  conta: true,  hist: true,  score: 800 },
    ];
    for (const u of utilizadores) {
      const { rows: [user] } = await client.query(`
        INSERT INTO utilizadores (nome, email, password_hash, tipo)
        VALUES ($1, $2, $3, 'utilizador')
        ON CONFLICT (email) DO UPDATE SET nome = EXCLUDED.nome
        RETURNING id`, [u.nome, u.email, userHash]);
      await client.query(`
        INSERT INTO perfis_financeiros
          (utilizador_id, rendimento_mensal, despesas_mensais, dependentes,
           nivel_educacao, situacao_emprego, tem_conta_bancaria,
           tem_historico_credito, score_credito, objetivo_financeiro)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'todos')
        ON CONFLICT (utilizador_id) DO NOTHING`,
        [user.id, u.rendimento, u.despesas, u.dep, u.edu, u.emp, u.conta, u.hist, u.score]);
    }

    // Serviços financeiros — foco em créditos
    const servicos = [
      // ── Banco BIC (0)
      { pid: provedorIds[0], nome: 'Crédito Pessoal BIC Express',       tipo: 'credito_pessoal',   taxa: 18.5, pmin: 6,  pmax: 48,  mmin: 50000,   mmax: 5000000,  rmin: 60000,  score: 500, conta: true },
      { pid: provedorIds[0], nome: 'Microcrédito BIC Empreendedor',     tipo: 'microcredito',      taxa: 14.0, pmin: 3,  pmax: 24,  mmin: 10000,   mmax: 500000,   rmin: 0,      score: 0,   conta: false },
      { pid: provedorIds[0], nome: 'Crédito Pessoal BIC Médio',         tipo: 'credito_pessoal',   taxa: 22.0, pmin: 12, pmax: 36,  mmin: 100000,  mmax: 2000000,  rmin: 80000,  score: 400, conta: true },
      { pid: provedorIds[0], nome: 'Crédito Habitação BIC Prime',       tipo: 'credito_habitacao', taxa: 11.5, pmin: 60, pmax: 360, mmin: 2000000, mmax: 80000000, rmin: 200000, score: 700, conta: true },
      { pid: provedorIds[0], nome: 'Crédito Consolidado BIC',           tipo: 'credito_pessoal',   taxa: 19.0, pmin: 12, pmax: 60,  mmin: 150000,  mmax: 10000000, rmin: 100000, score: 550, conta: true },
      { pid: provedorIds[0], nome: 'Crédito Funcionário Público BIC',   tipo: 'credito_pessoal',   taxa: 15.0, pmin: 6,  pmax: 48,  mmin: 80000,   mmax: 6000000,  rmin: 90000,  score: 350, conta: true },

      // ── Millennium BCP (1)
      { pid: provedorIds[1], nome: 'Crédito Habitação Millennium',      tipo: 'credito_habitacao', taxa: 12.0, pmin: 60, pmax: 360, mmin: 1000000, mmax: 50000000, rmin: 150000, score: 700, conta: true },
      { pid: provedorIds[1], nome: 'Crédito Pessoal Millennium',        tipo: 'credito_pessoal',   taxa: 17.5, pmin: 6,  pmax: 48,  mmin: 50000,   mmax: 4000000,  rmin: 70000,  score: 450, conta: true },
      { pid: provedorIds[1], nome: 'Microcrédito Millennium Empreender',tipo: 'microcredito',      taxa: 13.5, pmin: 3,  pmax: 24,  mmin: 20000,   mmax: 800000,   rmin: 30000,  score: 0,   conta: false },
      { pid: provedorIds[1], nome: 'Crédito Pessoal Online Millennium', tipo: 'credito_pessoal',   taxa: 16.9, pmin: 3,  pmax: 36,  mmin: 40000,   mmax: 3000000,  rmin: 60000,  score: 400, conta: true },
      { pid: provedorIds[1], nome: 'Crédito Habitação Millennium Jovem',tipo: 'credito_habitacao', taxa: 10.8, pmin: 60, pmax: 360, mmin: 1500000, mmax: 40000000, rmin: 180000, score: 650, conta: true },

      // ── Standard Bank (2)
      { pid: provedorIds[2], nome: 'Crédito Pessoal Standard',          tipo: 'credito_pessoal',   taxa: 18.0, pmin: 6,  pmax: 48,  mmin: 60000,   mmax: 5000000,  rmin: 80000,  score: 500, conta: true },
      { pid: provedorIds[2], nome: 'Crédito Habitação Standard',        tipo: 'credito_habitacao', taxa: 12.5, pmin: 60, pmax: 300, mmin: 1500000, mmax: 60000000, rmin: 180000, score: 680, conta: true },
      { pid: provedorIds[2], nome: 'Microcrédito Standard Empresarial', tipo: 'microcredito',      taxa: 15.0, pmin: 3,  pmax: 24,  mmin: 50000,   mmax: 2000000,  rmin: 50000,  score: 300, conta: false },

      // ── BAI (3)
      { pid: provedorIds[3], nome: 'Crédito Pessoal BAI',               tipo: 'credito_pessoal',   taxa: 14.9, pmin: 3,  pmax: 48,  mmin: 30000,   mmax: 3000000,  rmin: 60000,  score: 330, conta: true },
      { pid: provedorIds[3], nome: 'Crédito Habitação BAI',             tipo: 'credito_habitacao', taxa: 11.0, pmin: 60, pmax: 360, mmin: 2000000, mmax: 70000000, rmin: 200000, score: 700, conta: true },
      { pid: provedorIds[3], nome: 'Microcrédito BAI Mwana',            tipo: 'microcredito',      taxa: 12.5, pmin: 3,  pmax: 18,  mmin: 10000,   mmax: 300000,   rmin: 0,      score: 0,   conta: false },
      { pid: provedorIds[3], nome: 'Crédito Pessoal BAI Salário',       tipo: 'credito_pessoal',   taxa: 13.9, pmin: 3,  pmax: 36,  mmin: 40000,   mmax: 2000000,  rmin: 55000,  score: 350, conta: true },

      // ── BFA (4)
      { pid: provedorIds[4], nome: 'Crédito Pessoal BFA',               tipo: 'credito_pessoal',   taxa: 16.5, pmin: 6,  pmax: 48,  mmin: 50000,   mmax: 4000000,  rmin: 75000,  score: 450, conta: true },
      { pid: provedorIds[4], nome: 'Crédito Habitação BFA',             tipo: 'credito_habitacao', taxa: 11.8, pmin: 60, pmax: 360, mmin: 1500000, mmax: 50000000, rmin: 160000, score: 680, conta: true },
      { pid: provedorIds[4], nome: 'Microcrédito BFA Negócio',          tipo: 'microcredito',      taxa: 14.5, pmin: 3,  pmax: 24,  mmin: 30000,   mmax: 1000000,  rmin: 35000,  score: 0,   conta: false },
      { pid: provedorIds[4], nome: 'Crédito Pessoal BFA Prestígio',     tipo: 'credito_pessoal',   taxa: 15.5, pmin: 6,  pmax: 60,  mmin: 120000,  mmax: 8000000,  rmin: 120000, score: 600, conta: true },

      // ── Banco Sol (5)
      { pid: provedorIds[5], nome: 'Microcrédito Banco Sol',            tipo: 'microcredito',      taxa: 16.0, pmin: 3,  pmax: 24,  mmin: 5000,    mmax: 400000,   rmin: 25000,  score: 0,   conta: false },
      { pid: provedorIds[5], nome: 'Crédito Pessoal Banco Sol',         tipo: 'credito_pessoal',   taxa: 19.5, pmin: 6,  pmax: 36,  mmin: 40000,   mmax: 2000000,  rmin: 60000,  score: 380, conta: true },
      { pid: provedorIds[5], nome: 'Crédito Habitação Banco Sol',       tipo: 'credito_habitacao', taxa: 13.0, pmin: 60, pmax: 300, mmin: 1000000, mmax: 30000000, rmin: 140000, score: 650, conta: true },

      // ── Banco Económico (6)
      { pid: provedorIds[6], nome: 'Crédito Pessoal Económico',         tipo: 'credito_pessoal',   taxa: 20.0, pmin: 6,  pmax: 48,  mmin: 50000,   mmax: 5000000,  rmin: 80000,  score: 420, conta: true },
      { pid: provedorIds[6], nome: 'Crédito Habitação Económico',       tipo: 'credito_habitacao', taxa: 12.2, pmin: 60, pmax: 360, mmin: 2000000, mmax: 60000000, rmin: 190000, score: 690, conta: true },
      { pid: provedorIds[6], nome: 'Microcrédito Económico Start',      tipo: 'microcredito',      taxa: 15.5, pmin: 3,  pmax: 18,  mmin: 15000,   mmax: 500000,   rmin: 20000,  score: 0,   conta: false },

      // ── BNI (7)
      { pid: provedorIds[7], nome: 'Crédito Pessoal BNI',               tipo: 'credito_pessoal',   taxa: 17.8, pmin: 6,  pmax: 48,  mmin: 60000,   mmax: 4500000,  rmin: 75000,  score: 480, conta: true },
      { pid: provedorIds[7], nome: 'Microcrédito BNI Crescer',          tipo: 'microcredito',      taxa: 14.2, pmin: 3,  pmax: 24,  mmin: 20000,   mmax: 700000,   rmin: 30000,  score: 0,   conta: false },
      { pid: provedorIds[7], nome: 'Crédito Habitação BNI',             tipo: 'credito_habitacao', taxa: 11.9, pmin: 60, pmax: 360, mmin: 1800000, mmax: 55000000, rmin: 170000, score: 670, conta: true },

      // ── Créditos adicionais — taxas e intervalos variados (RN: mais oferta no mercado)
      // Pessoais de baixo valor / curto prazo
      { pid: provedorIds[2], nome: 'Crédito Pessoal Standard Flex',     tipo: 'credito_pessoal',   taxa: 21.5, pmin: 1,  pmax: 12,  mmin: 20000,   mmax: 800000,   rmin: 40000,  score: 300, conta: true },
      { pid: provedorIds[3], nome: 'Crédito Pessoal BAI Jovem',         tipo: 'credito_pessoal',   taxa: 16.8, pmin: 2,  pmax: 24,  mmin: 25000,   mmax: 1500000,  rmin: 45000,  score: 350, conta: false },
      { pid: provedorIds[5], nome: 'Crédito Pessoal Sol Rápido',        tipo: 'credito_pessoal',   taxa: 23.0, pmin: 1,  pmax: 18,  mmin: 15000,   mmax: 600000,   rmin: 35000,  score: 250, conta: false },
      { pid: provedorIds[6], nome: 'Crédito Pessoal Económico Curto',   tipo: 'credito_pessoal',   taxa: 24.5, pmin: 1,  pmax: 12,  mmin: 10000,   mmax: 500000,   rmin: 30000,  score: 250, conta: false },
      { pid: provedorIds[7], nome: 'Crédito Pessoal BNI Start',         tipo: 'credito_pessoal',   taxa: 20.5, pmin: 2,  pmax: 24,  mmin: 30000,   mmax: 2000000,  rmin: 50000,  score: 320, conta: true },

      // Pessoais de médio/alto valor com taxas competitivas
      { pid: provedorIds[1], nome: 'Crédito Pessoal Millennium Plus',   tipo: 'credito_pessoal',   taxa: 15.8, pmin: 6,  pmax: 60,  mmin: 200000,  mmax: 12000000, rmin: 120000, score: 600, conta: true },
      { pid: provedorIds[4], nome: 'Crédito Pessoal BFA Max',           tipo: 'credito_pessoal',   taxa: 14.8, pmin: 6,  pmax: 72,  mmin: 250000,  mmax: 15000000, rmin: 150000, score: 650, conta: true },
      { pid: provedorIds[0], nome: 'Crédito Pessoal BIC Gold',          tipo: 'credito_pessoal',   taxa: 13.9, pmin: 12, pmax: 84,  mmin: 500000,  mmax: 20000000, rmin: 180000, score: 720, conta: true },
      { pid: provedorIds[2], nome: 'Crédito Pessoal Standard Platinum', tipo: 'credito_pessoal',   taxa: 13.2, pmin: 12, pmax: 60,  mmin: 300000,  mmax: 18000000, rmin: 160000, score: 700, conta: true },

      // Microcrédito adicional — montantes pequenos e muito pequenos
      { pid: provedorIds[2], nome: 'Microcrédito Standard Comércio',    tipo: 'microcredito',      taxa: 17.0, pmin: 2,  pmax: 12,  mmin: 8000,    mmax: 300000,   rmin: 20000,  score: 0,   conta: false },
      { pid: provedorIds[3], nome: 'Microcrédito BAI Família',          tipo: 'microcredito',      taxa: 13.0, pmin: 3,  pmax: 24,  mmin: 12000,   mmax: 450000,   rmin: 0,      score: 0,   conta: false },
      { pid: provedorIds[5], nome: 'Microcrédito Sol Vendedor',         tipo: 'microcredito',      taxa: 18.0, pmin: 1,  pmax: 12,  mmin: 5000,    mmax: 200000,   rmin: 15000,  score: 0,   conta: false },
      { pid: provedorIds[6], nome: 'Microcrédito Económico Informal',   tipo: 'microcredito',      taxa: 16.5, pmin: 1,  pmax: 18,  mmin: 7000,    mmax: 250000,   rmin: 12000,  score: 0,   conta: false },

      // Crédito habitação adicional — segmentos premium e social
      { pid: provedorIds[5], nome: 'Crédito Habitação Sol Social',      tipo: 'credito_habitacao', taxa: 9.9,  pmin: 60, pmax: 480, mmin: 800000,  mmax: 20000000, rmin: 100000, score: 550, conta: true },
      { pid: provedorIds[4], nome: 'Crédito Habitação BFA Pro',         tipo: 'credito_habitacao', taxa: 10.5, pmin: 60, pmax: 360, mmin: 3000000, mmax: 90000000, rmin: 220000, score: 720, conta: true },
      { pid: provedorIds[1], nome: 'Crédito Habitação Millennium Verde',tipo: 'credito_habitacao', taxa: 9.5,  pmin: 60, pmax: 360, mmin: 2500000, mmax: 60000000, rmin: 200000, score: 700, conta: true },
      { pid: provedorIds[6], nome: 'Crédito Habitação Económico Longo', tipo: 'credito_habitacao', taxa: 11.2, pmin: 72, pmax: 420, mmin: 1500000, mmax: 70000000, rmin: 150000, score: 650, conta: true },

      // Seguros, poupança e investimento — diversidade de tipos (evita lista só de créditos)
      { pid: provedorIds[0], nome: 'Seguro de Vida BIC Familiar',       tipo: 'seguro_vida',      taxa: 4.5,  pmin: 12, pmax: 240, mmin: 5000,   mmax: 100000,   rmin: 20000,  score: 0,   conta: false },
      { pid: provedorIds[1], nome: 'Seguro de Saúde Millennium',        tipo: 'seguro_saude',     taxa: 6.0,  pmin: 12, pmax: 120, mmin: 15000,  mmax: 500000,   rmin: 30000,  score: 0,   conta: false },
      { pid: provedorIds[3], nome: 'Conta Poupança BAI Crescer',        tipo: 'conta_poupanca',   taxa: 3.5,  pmin: 1,  pmax: 60,  mmin: 5000,   mmax: 5000000,  rmin: 10000,  score: 0,   conta: true },
      { pid: provedorIds[4], nome: 'Investimento BFA Fundo',            tipo: 'investimento',     taxa: 8.0,  pmin: 12, pmax: 120, mmin: 50000,  mmax: 20000000, rmin: 50000,  score: 0,   conta: true },
      { pid: provedorIds[7], nome: 'Seguro Automóvel BNI Total',        tipo: 'seguro_automovel', taxa: 7.5,  pmin: 12, pmax: 60,  mmin: 20000,  mmax: 3000000,  rmin: 25000,  score: 0,   conta: false },
    ];
    for (const s of servicos) {
      await client.query(`
        INSERT INTO servicos_financeiros
          (provedor_id, nome, tipo, taxa_juro_anual, prazo_minimo_meses, prazo_maximo_meses,
           montante_minimo, montante_maximo, rendimento_minimo, score_credito_minimo, requer_conta_bancaria)
        SELECT $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
        WHERE NOT EXISTS (
          SELECT 1 FROM servicos_financeiros WHERE nome = $2 AND provedor_id = $1
        )`,
        [s.pid, s.nome, s.tipo, s.taxa, s.pmin, s.pmax, s.mmin, s.mmax, s.rmin, s.score, s.conta]);
    }

    // Modelo preditivo — histórico de versões
    const modelos = [
      { versao: 'v1.0.0', algo: 'regressao_logistica',     ac: 0.7500, pr: 0.7222, rc: 0.7959, f1: 0.7573, auc: 0.8399, samples: 500, ativo: true,  data: '2026-01-15 10:00:00+00' },
      { versao: 'v1.1.0', algo: 'regressao_logistica',     ac: 0.7340, pr: 0.7120, rc: 0.7560, f1: 0.7335, auc: 0.7780, samples: 250, ativo: false, data: '2026-02-20 14:30:00+00' },
      { versao: 'v1.2.0', algo: 'regressao_logistica',     ac: 0.7810, pr: 0.7650, rc: 0.7970, f1: 0.7807, auc: 0.8210, samples: 480, ativo: false, data: '2026-04-10 09:15:00+00' },
      { versao: 'v2.0.0', algo: 'regressao_logistica',     ac: 0.8120, pr: 0.7940, rc: 0.8300, f1: 0.8116, auc: 0.8450, samples: 750, ativo: false, data: '2026-05-28 16:45:00+00' },
      { versao: 'v2.1.0', algo: 'regressao_logistica',     ac: 0.8460, pr: 0.8310, rc: 0.8610, f1: 0.8458, auc: 0.8790, samples: 1120, ativo: false, data: '2026-07-10 11:00:00+00' },
    ];
    for (const m of modelos) {
      await client.query(`
        INSERT INTO modelos_preditivos
          (versao, algoritmo, acuracia, precisao, recall, f1_score, auc_roc, amostras_treino, ativo, criado_em)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        ON CONFLICT (versao) DO UPDATE SET
          acuracia = EXCLUDED.acuracia, precisao = EXCLUDED.precisao,
          recall = EXCLUDED.recall, f1_score = EXCLUDED.f1_score,
          auc_roc = EXCLUDED.auc_roc, amostras_treino = EXCLUDED.amostras_treino,
          ativo = EXCLUDED.ativo, criado_em = EXCLUDED.criado_em`,
        [m.versao, m.algo, m.ac, m.pr, m.rc, m.f1, m.auc, m.samples, m.ativo, m.data]);
    }

    await client.query('COMMIT');
    console.log('✅  Dados de exemplo inseridos com sucesso.');
    console.log('   Credenciais de teste:');
    console.log('   • Admin:     admin@srfs.ao / Admin@2025!');
    console.log('   • Utilizador: ana@exemplo.ao / User@2025!');
    console.log('   • Provedor:  bic@srfs.ao / Banco@2025!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌  Erro no seed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
