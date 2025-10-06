const mapMood = (label) => {
  const moodMap = {
    happy: "Happy",
    neutral: "Calm",
    sad: "Melancholic",
    angry: "Energetic",
    surprised: "Excited",
    fear: "Melancholic",
    disgust: "Melancholic",
    joy: "Happy",
    sadness: "Melancholic",
    anger: "Energetic",
    surprise: "Excited"
  };

  // Convert label to lowercase for matching
  const normalizedLabel = label.toLowerCase();
  return moodMap[normalizedLabel] || "Neutral";
};

module.exports = { mapMood };
