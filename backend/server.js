const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import modules
const { getConnection } = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==================== ROUTES ====================
app.use('/api', apiRoutes);

// ==================== ERROR HANDLING ====================
// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║   SIMRS Face ID Backend Server                    ║');
  console.log('╠═══════════════════════════════════════════════════╣');
  console.log(`║   Running on port: ${PORT.toString().padEnd(37)} ║`);
  console.log(`║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(36)} ║`);
  console.log('║   API endpoint: http://localhost:' + PORT.toString().padEnd(13) + '         ║');
  console.log('╚═══════════════════════════════════════════════════╝');
  console.log('');
});
