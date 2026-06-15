const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'srfs_db',
  user:     process.env.DB_USER     || 'srfs_user',
  password: process.env.DB_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('[DB] Ligação estabelecida ao PostgreSQL');
});

pool.on('error', (err) => {
  console.error('[DB] Erro inesperado:', err);
  process.exit(-1);
});

// Helper: query com log de erros
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DB] query (${duration}ms) → ${result.rowCount} linha(s)`);
    }
    return result;
  } catch (err) {
    console.error('[DB] Erro na query:', { text, params, err: err.message });
    throw err;
  }
};

// Helper: transação
const withTransaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { pool, query, withTransaction };
