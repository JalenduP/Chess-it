// backend/utils/eloRating.js

/**
 * Calculate ELO rating changes for both players
 * @param {number} whiteRating - Current rating of white player
 * @param {number} blackRating - Current rating of black player
 * @param {number} whiteScore - Score for white (1 = win, 0.5 = draw, 0 = loss)
 * @param {number} kFactor - K-factor (default 32)
 * @returns {object} Rating changes for both players
 */
const calculateEloChange = (whiteRating, blackRating, whiteScore, kFactor = 32) => {
  // Expected scores
  const whiteExpected = 1 / (1 + Math.pow(10, (blackRating - whiteRating) / 400));
  const blackExpected = 1 - whiteExpected;

  // Actual scores
  const blackScore = 1 - whiteScore;

  // Calculate rating changes
  const whiteChange = Math.round(kFactor * (whiteScore - whiteExpected));
  const blackChange = Math.round(kFactor * (blackScore - blackExpected));

  return {
    whiteChange,
    blackChange,
    whiteExpected,
    blackExpected
  };
};

/**
 * Get K-factor based on rating and number of games
 * @param {number} rating - Player's current rating
 * @param {number} gamesPlayed - Number of games played
 * @returns {number} K-factor
 */
const getKFactor = (rating, gamesPlayed) => {
  // New players (< 30 games): K = 40
  if (gamesPlayed < 30) {
    return 40;
  }
  
  // Strong players (rating >= 2400): K = 16
  if (rating >= 2400) {
    return 16;
  }
  
  // Everyone else: K = 32
  return 32;
};

/**
 * Calculate rating change with dynamic K-factor
 */
const calculateDynamicEloChange = (whiteRating, blackRating, whiteScore, whiteGames, blackGames) => {
  const whiteK = getKFactor(whiteRating, whiteGames);
  const blackK = getKFactor(blackRating, blackGames);

  const whiteExpected = 1 / (1 + Math.pow(10, (blackRating - whiteRating) / 400));
  const blackExpected = 1 - whiteExpected;

  const blackScore = 1 - whiteScore;

  const whiteChange = Math.round(whiteK * (whiteScore - whiteExpected));
  const blackChange = Math.round(blackK * (blackScore - blackExpected));

  return {
    whiteChange,
    blackChange,
    whiteExpected,
    blackExpected
  };
};

module.exports = {
  calculateEloChange,
  getKFactor,
  calculateDynamicEloChange
};