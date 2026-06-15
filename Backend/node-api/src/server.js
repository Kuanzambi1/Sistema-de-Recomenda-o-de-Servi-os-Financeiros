require('dotenv').config();
const express     = require('express');
const helmet      = require('helmet');
const cors        = require('cors');
const morgan      = require('morgan');
const rateLimit   = require('express-rate-limit');

const routes            = require('./routes');
const { errorHandler }  = require('./middleware/errorHandler');
const { pool }          = require('./config/database');

const app  = express();
const PORT = process.env.PORT || 3000;

// -----------------------------------------------
// Segurança e parsing
// -----------------------------------------------
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET','POST','PUT','PATCH','DELETE'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// -----------------------------------------------
// Logging
// -----------------------------------------------
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// -----------------------------------------------
// Rate limiting (RN — protecção contra abuso)
// -----------------------------------------------
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max:      parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message:  { erro: 'Demasiados pedidos. Tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders:   false,
});
app.use('/api/', limiter);

// -----------------------------------------------
// Rotas
// -----------------------------------------------
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      estado: 'ok',
      servico: 'SRFS Node.js API',
      versao: '1.0.0',
      ambiente: process.env.NODE_ENV,
      base_dados: 'ligada',
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(503).json({ estado: 'erro', base_dados: 'desligada' });
  }
});

app.use('/api', routes);

// 404
app.use((req, res) => {
  res.status(404).json({ erro: `Rota não encontrada: ${req.method} ${req.path}` });
});

// Tratamento global de erros
app.use(errorHandler);

// -----------------------------------------------
// Arranque
// -----------------------------------------------
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════╗');
  console.log(`║  SRFS API  →  http://localhost:${PORT}     ║`);
  console.log(`║  Ambiente: ${process.env.NODE_ENV || 'development'}                  ║`);
  console.log('╚════════════════════════════════════════╝');
});

module.exports = app;
