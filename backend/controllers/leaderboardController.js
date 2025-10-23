// controllers/leaderboardController.js
const User = require('../models/User');

// @desc    Get leaderboard (top players by rating/wins)
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const { limit = 100, sortBy = 'rating' } = req.query;

    // Determine sort criteria
    let sortCriteria = {};
    switch (sortBy) {
      case 'rating':
        sortCriteria = { rating: -1 };
        break;
      case 'wins':
        sortCriteria = { wins: -1 };
        break;
      case 'gamesPlayed':
        sortCriteria = { gamesPlayed: -1 };
        break;
      default:
        sortCriteria = { rating: -1 };
    }

    const leaderboard = await User.find()
      .select('username rating wins losses draws gamesPlayed')
      .sort(sortCriteria)
      .limit(parseInt(limit));

    // Add rank to each user
    const leaderboardWithRanks = leaderboard.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      username: user.username,
      rating: user.rating || 1200,
      wins: user.wins || 0,
      losses: user.losses || 0,
      draws: user.draws || 0,
      gamesPlayed: user.gamesPlayed || 0,
      winRate: user.gamesPlayed > 0 
        ? ((user.wins / user.gamesPlayed) * 100).toFixed(1) 
        : 0
    }));

    res.json({
      success: true,
      count: leaderboardWithRanks.length,
      leaderboard: leaderboardWithRanks
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get specific user's rank
// @route   GET /api/leaderboard/rank/:userId
// @access  Public
const getUserRank = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('username rating wins losses draws gamesPlayed');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Count how many users have a higher rating
    const higherRatedCount = await User.countDocuments({
      rating: { $gt: user.rating || 1200 }
    });

    const rank = higherRatedCount + 1;

    // Get total number of users for context
    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      rank,
      totalUsers,
      user: {
        userId: user._id,
        username: user.username,
        rating: user.rating || 1200,
        wins: user.wins || 0,
        losses: user.losses || 0,
        draws: user.draws || 0,
        gamesPlayed: user.gamesPlayed || 0,
        winRate: user.gamesPlayed > 0 
          ? ((user.wins / user.gamesPlayed) * 100).toFixed(1) 
          : 0
      },
      percentile: totalUsers > 0 
        ? (((totalUsers - rank + 1) / totalUsers) * 100).toFixed(1)
        : 0
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

module.exports = {
  getLeaderboard,
  getUserRank
};