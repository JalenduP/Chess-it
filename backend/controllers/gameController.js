// backend/controllers/gameController.js
const Game = require('../models/Game');
const User = require('../models/User');
const { calculateEloChange } = require('../utils/eloRating');

// @desc    Create a new game (matchmaking)
// @route   POST /api/games/create
// @access  Private
const createGame = async (req, res) => {
  try {
    const { timeControl } = req.body; // { minutes, increment }
    
    if (!timeControl || !timeControl.minutes || timeControl.increment === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Time control is required'
      });
    }

    // Find an opponent (simple matchmaking - find waiting game or create new)
    const waitingGame = await Game.findOne({
      status: 'waiting',
      'timeControl.minutes': timeControl.minutes,
      'timeControl.increment': timeControl.increment,
      white: { $ne: req.user._id }
    });

    if (waitingGame) {
      // Join existing game
      waitingGame.black = req.user._id;
      waitingGame.status = 'active';
      waitingGame.startedAt = Date.now();
      waitingGame.whiteTime = timeControl.minutes * 60 * 1000;
      waitingGame.blackTime = timeControl.minutes * 60 * 1000;
      waitingGame.lastMoveTime = Date.now();
      
      const whitePlayer = await User.findById(waitingGame.white);
      waitingGame.whiteRatingBefore = whitePlayer.rating;
      waitingGame.blackRatingBefore = req.user.rating;

      await waitingGame.save();

      const populatedGame = await Game.findById(waitingGame._id)
        .populate('white', 'username rating')
        .populate('black', 'username rating');

      return res.status(200).json({
        success: true,
        game: populatedGame
      });
    } else {
      // Create new waiting game
      const game = await Game.create({
        white: req.user._id,
        timeControl,
        status: 'waiting',
        whiteRatingBefore: req.user.rating,
        whiteTime: timeControl.minutes * 60 * 1000,
        blackTime: timeControl.minutes * 60 * 1000
      });

      const populatedGame = await Game.findById(game._id)
        .populate('white', 'username rating');

      return res.status(201).json({
        success: true,
        game: populatedGame
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get game by ID
// @route   GET /api/games/:gameId
// @access  Private
const getGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId)
      .populate('white', 'username rating isOnline')
      .populate('black', 'username rating isOnline');

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    // Check if user is part of this game
    if (game.white._id.toString() !== req.user._id.toString() && 
        game.black._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this game'
      });
    }

    res.status(200).json({
      success: true,
      game
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's game history
// @route   GET /api/games/history
// @access  Private
const getGameHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const games = await Game.find({
      $or: [
        { white: req.user._id },
        { black: req.user._id }
      ],
      status: 'completed'
    })
    .populate('white', 'username rating')
    .populate('black', 'username rating')
    .sort({ completedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const count = await Game.countDocuments({
      $or: [
        { white: req.user._id },
        { black: req.user._id }
      ],
      status: 'completed'
    });

    res.status(200).json({
      success: true,
      games,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Resign game
// @route   POST /api/games/:gameId/resign
// @access  Private
const resignGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    if (game.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Game is not active'
      });
    }

    // Determine who resigned
    const isWhite = game.white.toString() === req.user._id.toString();
    const isBlack = game.black.toString() === req.user._id.toString();

    if (!isWhite && !isBlack) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Update game result
    game.result = isWhite ? 'black_wins' : 'white_wins';
    game.resultReason = 'resignation';
    game.status = 'completed';
    game.completedAt = Date.now();

    // Calculate ELO changes
    const whitePlayer = await User.findById(game.white);
    const blackPlayer = await User.findById(game.black);

    const { whiteChange, blackChange } = calculateEloChange(
      whitePlayer.rating,
      blackPlayer.rating,
      game.result === 'white_wins' ? 1 : 0
    );

    game.whiteRatingChange = whiteChange;
    game.blackRatingChange = blackChange;

    // Update player stats
    whitePlayer.rating += whiteChange;
    blackPlayer.rating += blackChange;

    if (game.result === 'white_wins') {
      whitePlayer.wins += 1;
      blackPlayer.losses += 1;
    } else {
      blackPlayer.wins += 1;
      whitePlayer.losses += 1;
    }

    await whitePlayer.save();
    await blackPlayer.save();
    await game.save();

    const populatedGame = await Game.findById(game._id)
      .populate('white', 'username rating')
      .populate('black', 'username rating');

    res.status(200).json({
      success: true,
      game: populatedGame
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
  createGame,
  getGame,
  getGameHistory,
  resignGame
};