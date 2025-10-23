// backend/controllers/tournamentController.js
const Tournament = require('../models/Tournament');
const User = require('../models/User');

// @desc    Get all tournaments
// @route   GET /api/tournaments
// @access  Public
const getTournaments = async (req, res) => {
  try {
    const { status = 'registration' } = req.query;

    const tournaments = await Tournament.find({ status })
      .populate('organizer', 'username')
      .populate('participants.user', 'username rating')
      .sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      tournaments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single tournament
// @route   GET /api/tournaments/:id
// @access  Public
const getTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('organizer', 'username')
      .populate('participants.user', 'username rating')
      .populate('winner', 'username rating');

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    res.status(200).json({
      success: true,
      tournament
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create tournament
// @route   POST /api/tournaments
// @access  Private
const createTournament = async (req, res) => {
  try {
    const {
      title,
      description,
      timeControl,
      maxParticipants,
      type,
      registrationDeadline,
      startDate,
      restrictions
    } = req.body;

    const tournament = await Tournament.create({
      title,
      description,
      timeControl,
      maxParticipants,
      type: type || 'single_elimination',
      registrationDeadline,
      startDate,
      restrictions: restrictions || {},
      organizer: req.user._id
    });

    res.status(201).json({
      success: true,
      tournament
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Join tournament
// @route   POST /api/tournaments/:id/join
// @access  Private
const joinTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    if (tournament.status !== 'registration') {
      return res.status(400).json({
        success: false,
        message: 'Tournament registration is closed'
      });
    }

    if (tournament.participants.length >= tournament.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Tournament is full'
      });
    }

    // Check if already joined
    const alreadyJoined = tournament.participants.some(
      p => p.user.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: 'Already joined this tournament'
      });
    }

    // Check restrictions
    if (tournament.restrictions.minRating && req.user.rating < tournament.restrictions.minRating) {
      return res.status(400).json({
        success: false,
        message: `Minimum rating required: ${tournament.restrictions.minRating}`
      });
    }

    if (tournament.restrictions.maxRating && req.user.rating > tournament.restrictions.maxRating) {
      return res.status(400).json({
        success: false,
        message: `Maximum rating allowed: ${tournament.restrictions.maxRating}`
      });
    }

    // Add participant
    tournament.participants.push({
      user: req.user._id,
      seed: tournament.participants.length + 1
    });

    await tournament.save();

    const updatedTournament = await Tournament.findById(tournament._id)
      .populate('participants.user', 'username rating');

    res.status(200).json({
      success: true,
      tournament: updatedTournament
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Leave tournament
// @route   DELETE /api/tournaments/:id/leave
// @access  Private
const leaveTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    if (tournament.status !== 'registration') {
      return res.status(400).json({
        success: false,
        message: 'Cannot leave tournament after it has started'
      });
    }

    tournament.participants = tournament.participants.filter(
      p => p.user.toString() !== req.user._id.toString()
    );

    await tournament.save();

    res.status(200).json({
      success: true,
      message: 'Left tournament successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's tournaments
// @route   GET /api/tournaments/my
// @access  Private
const getMyTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find({
      'participants.user': req.user._id
    })
    .populate('organizer', 'username')
    .sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      tournaments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getTournaments,
  getTournament,
  createTournament,
  joinTournament,
  leaveTournament,
  getMyTournaments
};