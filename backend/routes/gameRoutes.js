const express = require('express');
const router = express.Router();
const {
  createGame,
  getGame,
  getGameHistory,
  resignGame
} = require('../controllers/gameController');
const { protect } = require('../middleware/auth');

router.post('/create', protect, createGame);
router.get('/history', protect, getGameHistory);
router.get('/:gameId', protect, getGame);
router.post('/:gameId/resign', protect, resignGame);

module.exports = router;
