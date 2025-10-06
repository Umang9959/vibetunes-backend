const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes - Fixed path for flat file structure
const moodRoutes = require('./moodRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`🚀 ${timestamp} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api', moodRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'VibeTunes Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/test',
      moodDetection: '/api/detectMood'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('💥 Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on our end'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🎵 VibeTunes Backend Server Started');
  console.log(`🌐 Server running on port: ${PORT}`);
  console.log(`🔑 Hugging Face Token: ${process.env.HF_TOKEN ? '✅ Configured' : '❌ Missing'}`);
});

module.exports = app;
