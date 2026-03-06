require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();

// ── Security Middleware ─────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate Limiting ───────────────────────────────
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { error: 'Too many requests, try again later.' } });
const strictLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: { error: 'Too many submissions, try again later.' } });

app.use('/api/', apiLimiter);

// ensure uploads folder exists
const fs = require('fs');

const uploadPath = path.join(__dirname, 'uploads');   // new path for uploads/////////////////

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("📁 uploads folder created");
}

// ── Static Files (uploads) ──────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ──────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/contacts',  require('./routes/contacts'));
app.use('/api/quotes',    require('./routes/quotes'));
app.use('/api/gallery',   require('./routes/gallery'));
app.use('/api/services',  require('./routes/services'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/settings',  require('./routes/settings'));
app.use('/api/dashboard', require('./routes/dashboard'));

// ── Health check ────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

// ── 404 Handler ─────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Global Error Handler ────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// ── Start Server ────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 PVC Contractor API running on http://localhost:${PORT}`);
  console.log(`📖 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
