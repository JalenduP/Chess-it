const express = require('express');
const router = express.Router();
const {
  getLeaderboard,
  getUserRank
} = require('../controllers/leaderboardController');

router.get('/', getLeaderboard);
router.get('/rank/:userId', getUserRank);

module.exports = router;
