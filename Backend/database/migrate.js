const fs   = require('fs');
const path = require('path');

// Resolve modules from node-api folder
module.paths.unshift(path.join(__dirname, '../node-api/node_modules'));

const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../node-api/.env') });

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  try {
    console.log('🗄️  A executar migração...');
    await pool.query(sql);
    console.log('✅  Migração concluída — tabelas criadas com sucesso.');
  } catch (err) {
    console.error('❌  Erro na migração:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
