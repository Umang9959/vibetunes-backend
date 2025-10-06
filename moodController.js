const axios = require('axios');
const { mapMood } = require('./moodMapper'); // Fixed path

// Hugging Face API configuration
const HF_API_URL = 'https://api-inference.huggingface.co/models/Sanster/liteface_emotion';

const detectMood = async (req, res) => {
  try {
    const { image } = req.body;

    // Validate input
    if (!image) {
      return res.status(400).json({
        error: 'No image provided',
        message: 'Please provide a base64 encoded image'
      });
    }

    // Validate Hugging Face token
    if (!process.env.HF_TOKEN) {
      console.error('❌ HF_TOKEN not found in environment variables');
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'AI service not properly configured'
      });
    }

    console.log('🔍 Starting AI mood detection...');
    console.log('📡 Calling Hugging Face API...');

    // Convert base64 to buffer for Hugging Face API
    let imageBuffer;
    try {
      // Remove data URL prefix if present
      const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, '');
      imageBuffer = Buffer.from(base64Data, 'base64');
    } catch (error) {
      console.error('❌ Invalid base64 image data:', error.message);
      return res.status(400).json({
        error: 'Invalid image data',
        message: 'Please provide a valid base64 encoded image'
      });
    }

    // Call Hugging Face API
    const response = await axios.post(
      HF_API_URL,
      imageBuffer,
      {
        headers: {
          'Authorization': `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/octet-stream'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    console.log('📥 Hugging Face API Response:', response.data);

    // Process the response
    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      console.error('❌ Invalid response from Hugging Face API');
      return res.status(500).json({
        error: 'AI processing error',
        message: 'Unable to process the image'
      });
    }

    // Get the highest confidence emotion
    const emotions = response.data;
    const topEmotion = emotions.reduce((prev, current) =>
      (prev.score > current.score) ? prev : current
    );

    console.log('🎯 Top emotion detected:', topEmotion);

    // Map emotion to app mood
    const mappedMood = mapMood(topEmotion.label);
    const confidence = topEmotion.score;

    console.log(`✅ Mood detection successful: ${mappedMood} (${(confidence * 100).toFixed(1)}%)`);

    // Return response in the format expected by Flutter app
    res.json({
      mood: mappedMood,
      confidence: confidence,
      rawEmotion: topEmotion.label,
      allEmotions: emotions
    });

  } catch (error) {
    console.error('❌ Error in mood detection:', error);

    // Handle specific error types
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'AI service unavailable',
        message: 'Unable to connect to AI service. Please try again later.'
      });
    }

    if (error.response) {
      // Hugging Face API error
      console.error('🔥 Hugging Face API Error:', error.response.status, error.response.data);

      if (error.response.status === 401) {
        return res.status(500).json({
          error: 'Authentication error',
          message: 'AI service authentication failed'
        });
      }

      if (error.response.status === 429) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.'
        });
      }

      return res.status(502).json({
        error: 'AI service error',
        message: 'AI service returned an error'
      });
    }

    // Generic server error
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing your request'
    });
  }
};

// Health check endpoint
const healthCheck = (req, res) => {
  console.log('🏥 Health check requested');

  const healthStatus = {
    message: 'VibeTunes API running',
    status: 'connected',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    huggingFaceConfigured: !!process.env.HF_TOKEN
  };

  console.log('✅ Health check response:', healthStatus);
  res.json(healthStatus);
};

module.exports = {
  detectMood,
  healthCheck
};
