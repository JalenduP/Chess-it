const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Tournament settings
  timeControl: {
    minutes: { type: Number, required: true },
    increment: { type: Number, required: true }
  },
  maxParticipants: {
    type: Number,
    required: true,
    default: 64
  },
  
  // Participants
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    seed: Number,
    currentRound: { type: Number, default: 0 },
    isEliminated: { type: Boolean, default: false }
  }],
  
  // Tournament structure
  type: {
    type: String,
    enum: ['single_elimination', 'round_robin', 'swiss'],
    default: 'single_elimination'
  },
  
  // Rounds and matches
  rounds: [{
    roundNumber: Number,
    matches: [{
      white: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      black: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
      winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }]
  }],
  
  // Status
  status: {
    type: String,
    enum: ['registration', 'in_progress', 'completed', 'cancelled'],
    default: 'registration'
  },
  
  // Winner
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // Organizer
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Restrictions
  restrictions: {
    minRating: { type: Number, default: 0 },
    maxRating: { type: Number, default: 3000 },
    departments: [String],
    batches: [String]
  },
  
  // Dates
  registrationDeadline: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tournament', tournamentSchema);