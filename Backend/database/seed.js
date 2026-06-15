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
      { nome: 'Banco BIC Angola',    email: 'bic@srfs.ao'    },
      { nome: 'Banco Millennium BCP', email: 'bcp@srfs.ao'   },
      { nome: 'Standard Bank Angola', email: 'stb@srfs.ao'   },
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

    // Serviços financeiros
    const servicos = [
      { pid: provedorIds[0], nome: 'Crédito Pessoal BIC Express',    tipo: 'credito_pessoal',    taxa: 18.5, pmin: 6,  pmax: 48,  mmin: 50000,  mmax: 5000000,  rmin: 60000,  score: 500, conta: true  },
      { pid: provedorIds[0], nome: 'Microcrédito BIC Empreendedor',  tipo: 'microcredito',        taxa: 14.0, pmin: 3,  pmax: 24,  mmin: 10000,  mmax: 500000,   rmin: 0,      score: 0,   conta: false },
      { pid: provedorIds[1], nome: 'Crédito Habitação Millennium',   tipo: 'credito_habitacao',   taxa: 12.0, pmin: 60, pmax: 360, mmin: 1000000,mmax: 50000000, rmin: 150000, score: 700, conta: true  },
      { pid: provedorIds[1], nome: 'Conta Poupança Millennium Plus', tipo: 'conta_poupanca',      taxa: 8.5,  pmin: 12, pmax: 60,  mmin: 5000,   mmax: null,     rmin: 30000,  score: 0,   conta: true  },
      { pid: provedorIds[2], nome: 'Seguro de Vida Standard Proteção',tipo: 'seguro_vida',        taxa: null, pmin: 12, pmax: 120, mmin: 2000,   mmax: null,     rmin: 40000,  score: 0,   conta: false },
      { pid: provedorIds[2], nome: 'Seguro de Saúde Standard Família',tipo: 'seguro_saude',       taxa: null, pmin: 12, pmax: 12,  mmin: 5000,   mmax: null,     rmin: 80000,  score: 0,   conta: false },
      { pid: provedorIds[0], nome: 'Crédito Pessoal BIC Médio',      tipo: 'credito_pessoal',    taxa: 22.0, pmin: 12, pmax: 36,  mmin: 100000, mmax: 2000000,  rmin: 80000,  score: 400, conta: true  },
    ];
    for (const s of servicos) {
      await client.query(`
        INSERT INTO servicos_financeiros
          (provedor_id, nome, tipo, taxa_juro_anual, prazo_minimo_meses, prazo_maximo_meses,
           montante_minimo, montante_maximo, rendimento_minimo, score_credito_minimo, requer_conta_bancaria)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [s.pid, s.nome, s.tipo, s.taxa, s.pmin, s.pmax, s.mmin, s.mmax, s.rmin, s.score, s.conta]);
    }

    // Modelo preditivo inicial
    await client.query(`
      INSERT INTO modelos_preditivos
        (versao, algoritmo, acuracia, precisao, recall, f1_score, auc_roc, amostras_treino, ativo)
      VALUES ('v1.0.0', 'regressao_logistica', 0.8120, 0.7940, 0.8300, 0.8116, 0.8450, 0, TRUE)
      ON CONFLICT (versao) DO NOTHING`);

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
