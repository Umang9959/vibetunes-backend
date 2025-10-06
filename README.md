# VibeTunes Backend API

## 🚀 Complete Node.js Backend for AI-Powered Mood Detection

This backend provides AI-powered mood detection using Hugging Face's emotion recognition models and serves the VibeTunes Flutter app.

## 📁 Project Structure

```
vibetunes-backend/
├── server.js                 # Main server file
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
├── routes/
│   └── moodRoutes.js        # API route definitions
├── controllers/
│   └── moodController.js    # Business logic for mood detection
└── utils/
    └── moodMapper.js        # Utility to map emotions to app moods
```

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
cd vibetunes-backend
npm install
```

### 2. Configure Environment Variables
Edit the `.env` file and add your Hugging Face API token:
```env
HF_TOKEN=hf_your_actual_token_here
PORT=5000
NODE_ENV=development
```

### 3. Get Hugging Face API Token
1. Go to https://huggingface.co/settings/tokens
2. Create a new token with "Read" permissions
3. Copy the token and paste it in your `.env` file

### 4. Run the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Health Check
- **GET** `/api/test`
- **Response:**
```json
{
  "message": "VibeTunes API running",
  "status": "connected",
  "timestamp": "2024-10-06T...",
  "huggingFaceConfigured": true
}
```

### Mood Detection
- **POST** `/api/detectMood`
- **Request Body:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
}
```
- **Response:**
```json
{
  "mood": "Happy",
  "confidence": 0.94,
  "rawEmotion": "joy",
  "allEmotions": [
    {"label": "joy", "score": 0.94},
    {"label": "neutral", "score": 0.04},
    {"label": "surprise", "score": 0.02}
  ]
}
```

## 🤖 AI Model Integration

The backend uses **Hugging Face's Inference API** with the emotion detection model:
- **Model:** `Sanster/liteface_emotion`
- **Purpose:** Facial emotion recognition
- **Input:** Base64 encoded images
- **Output:** Emotion probabilities

### Emotion to Mood Mapping
| Hugging Face Emotion | VibeTunes Mood |
|---------------------|----------------|
| happy, joy          | Happy          |
| neutral             | Calm           |
| sad, sadness        | Melancholic    |
| angry, anger        | Energetic      |
| surprised, surprise | Excited        |
| fear, disgust       | Melancholic    |

## 🌐 Deployment Options

### Option 1: Render.com (Recommended - Free Tier)
1. Push your code to GitHub
2. Connect to Render.com
3. Create new Web Service
4. Add environment variable: `HF_TOKEN`
5. Deploy automatically

### Option 2: Railway.app
1. Connect GitHub repository
2. Add `HF_TOKEN` environment variable
3. Deploy with one click

### Option 3: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Add environment variables in dashboard

## 🔧 Environment Variables Required

| Variable | Description | Required |
|----------|-------------|----------|
| `HF_TOKEN` | Hugging Face API token | ✅ Yes |
| `PORT` | Server port (default: 5000) | ❌ No |
| `NODE_ENV` | Environment mode | ❌ No |

## 🧪 Testing the Backend

### Local Testing
```bash
# Test health endpoint
curl http://localhost:5000/api/test

# Test mood detection (with sample base64 image)
curl -X POST http://localhost:5000/api/detectMood \
  -H "Content-Type: application/json" \
  -d '{"image": "data:image/jpeg;base64,..."}'
```

### Production Testing
Replace `localhost:5000` with your deployed URL:
```bash
curl https://your-app.onrender.com/api/test
```

## 🚨 Common Issues & Solutions

### Issue: "HF_TOKEN not found"
**Solution:** Make sure your `.env` file has the correct Hugging Face token

### Issue: "Invalid image data"
**Solution:** Ensure the base64 string includes the data URI prefix: `data:image/jpeg;base64,`

### Issue: Rate limiting from Hugging Face
**Solution:** The free tier has rate limits. Consider upgrading or implementing caching

## 📊 Monitoring & Logs

The server provides detailed console logging:
- 🚀 Request logging with timestamps
- 🔍 AI processing status
- 📥 Hugging Face API responses
- ❌ Error details and debugging info

## 🔒 Security Features

- CORS enabled for cross-origin requests
- Request payload size limits (10MB)
- Input validation for base64 images
- Error handling without exposing sensitive data
- Environment variable protection

## 🎯 Next Steps

1. **Get Hugging Face Token** (Required)
2. **Test locally** with `npm run dev`
3. **Deploy to Render.com** (Free)
4. **Update Flutter app** with your deployed URL

Your backend will be accessible at: `https://your-app-name.onrender.com`
