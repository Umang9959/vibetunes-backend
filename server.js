const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const moodRoutes = require('./routes/moodRoutes');

const app = express();
// Update port to avoid conflicts
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increase payload limit for base64 images
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
    },
    documentation: {
      detectMood: {
        method: 'POST',
        url: '/api/detectMood',
        body: {
          image: 'base64_encoded_image_string'
        },
        response: {
          mood: 'Happy',
          confidence: 0.94,
          rawEmotion: 'joy',
          allEmotions: '[]'
        }
      },
      healthCheck: {
        method: 'GET',
        url: '/api/test',
        response: {
          message: 'VibeTunes API running',
          status: 'connected'
        }
      }
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
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /api/test',
      'POST /api/detectMood'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🎵 =====================================');
  console.log('🎵 VibeTunes Backend Server Started');
  console.log('🎵 =====================================');
  console.log(`🌐 Server running on port: ${PORT}`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`🧪 Health check: http://localhost:${PORT}/api/test`);
  console.log(`🤖 AI Endpoint: http://localhost:${PORT}/api/detectMood`);
  console.log(`🔑 Hugging Face Token: ${process.env.HF_TOKEN ? '✅ Configured' : '❌ Missing'}`);
  console.log('🎵 =====================================');

  // Validate environment variables
  if (!process.env.HF_TOKEN) {
    console.log('⚠️  WARNING: HF_TOKEN not found in environment variables');
    console.log('💡 Please create a .env file with your Hugging Face token');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
