const express = require('express');
const router = express.Router();
const {
  getTournaments,
  getTournament,
  createTournament,
  joinTournament,
  leaveTournament,
  getMyTournaments
} = require('../controllers/tournamentController');
const { protect } = require('../middleware/auth');

router.get('/', getTournaments);
router.get('/my', protect, getMyTournaments);
router.get('/:id', getTournament);
router.post('/', protect, createTournament);
router.post('/:id/join', protect, joinTournament);
router.delete('/:id/leave', protect, leaveTournament);

module.exports = router;