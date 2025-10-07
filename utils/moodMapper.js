const mapMood = (label) => {
  const moodMap = {
    // Primary emotions
    happy: "Happy",
    joy: "Happy",
    pleasure: "Happy",

    // Calm/Neutral emotions - BUT with crying detection logic
    neutral: "Calm", // This will be overridden by emotion corrections if crying detected
    calm: "Calm",
    peaceful: "Calm",

    // Sad emotions - ENHANCED for crying detection
    sad: "Melancholic",
    sadness: "Melancholic",
    sorrow: "Melancholic",
    grief: "Melancholic",
    crying: "Melancholic",
    tears: "Melancholic",
    weeping: "Melancholic",

    // Angry/Energetic emotions
    angry: "Energetic",
    anger: "Energetic",
    rage: "Energetic",
    mad: "Energetic",

    // Surprised/Excited emotions
    surprised: "Excited",
    surprise: "Excited",
    amazement: "Excited",
    wonder: "Excited",

    // Fear emotions (map to Melancholic as they often accompany crying)
    fear: "Melancholic",
    scared: "Melancholic",
    afraid: "Melancholic",

    // Disgust emotions (map to Melancholic)
    disgust: "Melancholic",
    disgusted: "Melancholic",

    // Love/Romance emotions
    love: "Romantic",
    affection: "Romantic",
    romantic: "Romantic"
  };

  // Convert label to lowercase for matching
  const normalizedLabel = label.toLowerCase();
  return moodMap[normalizedLabel] || "Calm";
};

// Enhanced function to validate emotion consistency with crying detection
const validateEmotionConsistency = (bestResult, allResults) => {
  // If we only have one result, apply individual corrections
  if (allResults.length <= 1) {
    return applyCryingDetection(bestResult);
  }

  console.log('🔍 Validating emotion consistency across models...');

  // Count emotion types across all models
  const emotionCounts = {};
  const moodCounts = {};

  allResults.forEach(result => {
    const emotion = result.emotion.toLowerCase();
    const mood = mapMood(emotion);

    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });

  console.log('📊 Emotion distribution:', emotionCounts);
  console.log('📊 Mood distribution:', moodCounts);

  // CRITICAL FIX: Special crying detection across all results - CHECK THIS FIRST
  const hasCryingIndicators = checkForCryingAcrossModels(allResults);

  if (hasCryingIndicators) {
    console.log('😢 Crying indicators detected across models - forcing Melancholic mood');
    // FIXED: Actually return the forced result immediately
    return {
      emotion: 'sad',
      confidence: 0.85, // High confidence when crying detected
      allEmotions: bestResult.allEmotions
    };
  }

  // Continue with normal consensus logic only if no crying detected
  const mostCommonMood = Object.keys(moodCounts).reduce((a, b) =>
    moodCounts[a] > moodCounts[b] ? a : b
  );

  const consensusThreshold = Math.max(1, Math.floor(allResults.length / 2));

  if (moodCounts[mostCommonMood] >= consensusThreshold) {
    console.log(`✅ Found consensus for mood: ${mostCommonMood}`);

    const consensusResults = allResults.filter(result =>
      mapMood(result.emotion) === mostCommonMood
    );

    const bestConsensusResult = consensusResults.reduce((prev, current) =>
      (prev.confidence > current.confidence) ? prev : current
    );

    return {
      emotion: bestConsensusResult.emotion,
      confidence: Math.min(bestConsensusResult.confidence * 1.1, 0.95),
      allEmotions: bestConsensusResult.allEmotions
    };
  }

  console.log('⚠️ No consensus found, using best single result with confidence penalty');

  return {
    emotion: bestResult.emotion,
    confidence: bestResult.confidence * 0.85,
    allEmotions: bestResult.allEmotions
  };
};

// Check for crying indicators across multiple AI models
function checkForCryingAcrossModels(allResults) {
  let totalSadness = 0;
  let totalFear = 0;
  let totalNeutral = 0;
  let totalHappy = 0;
  let modelCount = allResults.length;

  allResults.forEach(result => {
    if (result.allEmotions) {
      const sadEmotion = result.allEmotions.find(e => e.label.toLowerCase() === 'sad');
      const fearEmotion = result.allEmotions.find(e => e.label.toLowerCase() === 'fear');
      const neutralEmotion = result.allEmotions.find(e => e.label.toLowerCase() === 'neutral');
      const happyEmotion = result.allEmotions.find(e => e.label.toLowerCase() === 'happy');

      if (sadEmotion) totalSadness += sadEmotion.score;
      if (fearEmotion) totalFear += fearEmotion.score;
      if (neutralEmotion) totalNeutral += neutralEmotion.score;
      if (happyEmotion) totalHappy += happyEmotion.score;
    }
  });

  // Average scores across models
  const avgSadness = totalSadness / modelCount;
  const avgFear = totalFear / modelCount;
  const avgNeutral = totalNeutral / modelCount;
  const avgHappy = totalHappy / modelCount;

  console.log(`🔍 Cross-model averages: Sad: ${(avgSadness * 100).toFixed(1)}%, Fear: ${(avgFear * 100).toFixed(1)}%, Neutral: ${(avgNeutral * 100).toFixed(1)}%, Happy: ${(avgHappy * 100).toFixed(1)}%`);

  // MUCH MORE PRECISE crying detection criteria - only trigger for genuinely sad cases
  const cryingDetected = (
    // Only if there's significant sadness AND low happiness
    (avgSadness > 0.15 && avgHappy < 0.1) ||
    // OR very high sadness regardless
    (avgSadness > 0.25) ||
    // OR strong fear+sadness combination with low happiness
    (avgFear > 0.1 && avgSadness > 0.1 && avgHappy < 0.05)
  );

  if (cryingDetected) {
    console.log('😢 CRYING DETECTED: Overriding to Melancholic mood');
  }

  return cryingDetected;
}

// Apply crying detection to individual results
function applyCryingDetection(result) {
  const { allEmotions } = result;

  const neutralEmotion = allEmotions.find(e => e.label.toLowerCase() === 'neutral');
  const sadEmotion = allEmotions.find(e => e.label.toLowerCase() === 'sad');
  const fearEmotion = allEmotions.find(e => e.label.toLowerCase() === 'fear');
  const happyEmotion = allEmotions.find(e => e.label.toLowerCase() === 'happy');

  // Enhanced crying detection for single model
  const neutralScore = neutralEmotion ? neutralEmotion.score : 0;
  const sadScore = sadEmotion ? sadEmotion.score : 0;
  const fearScore = fearEmotion ? fearEmotion.score : 0;
  const happyScore = happyEmotion ? happyEmotion.score : 0;

  console.log(`🔍 Single model analysis: Neutral: ${(neutralScore * 100).toFixed(1)}%, Sad: ${(sadScore * 100).toFixed(1)}%, Fear: ${(fearScore * 100).toFixed(1)}%, Happy: ${(happyScore * 100).toFixed(1)}%`);

  // MUCH MORE PRECISE single model crying detection - avoid false positives
  const cryingDetected = (
    // Only trigger for significant sadness with low happiness
    (sadScore > 0.2 && happyScore < 0.1) ||
    // OR very high sadness regardless
    (sadScore > 0.4) ||
    // OR high fear + moderate sadness with very low happiness
    (fearScore > 0.15 && sadScore > 0.1 && happyScore < 0.05)
  );

  if (cryingDetected) {
    console.log('😢 CRYING DETECTED in single model - forcing Melancholic');
    return {
      emotion: 'sad',
      confidence: 0.80,
      allEmotions: result.allEmotions
    };
  }

  return result;
}

module.exports = { mapMood, validateEmotionConsistency };
