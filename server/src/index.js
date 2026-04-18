// server/src/index.js
require('dotenv').config();

const path       = require('path');
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');

const db         = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes      = require('./routes/auth');
const quizRoutes      = require('./routes/quizzes');
const questionRoutes  = require('./routes/questions');
const userRoutes      = require('./routes/users');
const resultRoutes    = require('./routes/results');
const aiRoutes        = require('./routes/ai');
const stripeRoutes    = require('./routes/stripe');

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000;

// -------- global middleware ------------------------------------------
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
// Stripe webhook needs raw body — must be before express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Basic rate limit on auth endpoints (brute force protection)
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Static uploads (question images uploaded by admins)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// -------- health check ----------------------------------------------
app.get('/api/health', async (_req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', time: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected', error: err.message });
  }
});

// -------- API routes ------------------------------------------------
app.use('/api/auth',       authRoutes);
app.use('/api/quizzes',    quizRoutes);
app.use('/api/questions',  questionRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/results',    resultRoutes);
app.use('/api/ai',         aiRoutes);
app.use('/api/stripe',     stripeRoutes);

// -------- 404 & error -----------------------------------------------
app.use(notFound);
app.use(errorHandler);

// -------- start -----------------------------------------------------
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n  FAAExaminations API listening on port ${PORT}`);
    console.log(`  Health: http://localhost:${PORT}/api/health\n`);
  });
}

module.exports = app;
