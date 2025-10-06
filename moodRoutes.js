const express = require('express');
const { detectMood, healthCheck } = require('./moodController'); // Fixed path

const router = express.Router();

// Health check endpoint
router.get('/test', healthCheck);

// Mood detection endpoint
router.post('/detectMood', detectMood);

module.exports = router;
