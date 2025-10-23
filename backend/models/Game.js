// backend/models/Game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  // Players
  white: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  black: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Game settings
  timeControl: {
    minutes: { type: Number, required: true },
    increment: { type: Number, required: true }
  },
  
  // Game state
  fen: {
    type: String,
    default: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  },
  pgn: {
    type: String,
    default: ''
  },
  moves: [{
    from: String,
    to: String,
    san: String,
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Turn and status
  turn: {
    type: String,
    enum: ['white', 'black'],
    default: 'white'
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed', 'aborted'],
    default: 'waiting'
  },
  
  // Result
  result: {
    type: String,
    enum: ['white_wins', 'black_wins', 'draw', 'aborted', null],
    default: null
  },
  resultReason: {
    type: String,
    enum: ['checkmate', 'resignation', 'timeout', 'agreement', 'stalemate', 'insufficient_material', 'threefold_repetition', 'fifty_move_rule', 'aborted', null],
    default: null
  },
  
  // Time tracking
  whiteTime: { type: Number }, // milliseconds remaining
  blackTime: { type: Number }, // milliseconds remaining
  lastMoveTime: { type: Date },
  
  // Draw offers
  drawOffer: {
    by: { type: String, enum: ['white', 'black', null], default: null },
    timestamp: { type: Date },
    expiresAt: { type: Date }
  },
  
  // Ratings before game
  whiteRatingBefore: { type: Number },
  blackRatingBefore: { type: Number },
  
  // Rating changes
  whiteRatingChange: { type: Number, default: 0 },
  blackRatingChange: { type: Number, default: 0 },
  
  // Tournament reference (if part of tournament)
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    default: null
  },
  
  // Timestamps
  startedAt: { type: Date },
  completedAt: { type: Date },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
gameSchema.index({ white: 1, black: 1, status: 1 });
gameSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Game', gameSchema);