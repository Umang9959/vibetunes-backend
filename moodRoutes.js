const express = require('express');
const { detectMood } = require('../controllers/moodController');

const router = express.Router();

// Health check endpoint (inline function since it's simple)
router.get('/test', (req, res) => {
  res.json({
    message: 'VibeTunes API running',
    status: 'connected',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    huggingFaceConfigured: !!process.env.HF_TOKEN,
    aiMode: 'Enhanced Multi-Model AI Detection'
  });
});

// Mood detection endpoint
router.post('/detectMood', detectMood);

module.exports = router;
