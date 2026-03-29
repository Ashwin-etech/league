const mongoose = require('mongoose');

const cricketScoreSchema = new mongoose.Schema({
  teamRuns: {
    type: Number,
    required: true,
    min: 0
  },
  teamWickets: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  teamOvers: {
    type: Number,
    required: true,
    min: 0
  }
});

const throwballScoreSchema = new mongoose.Schema({
  teamPoints: {
    type: Number,
    required: true,
    min: 0
  },
  setsWon: {
    type: Number,
    required: true,
    min: 0
  }
});

const matchSchema = new mongoose.Schema({
  team1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: [true, 'Team 1 is required']
  },
  team2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: [true, 'Team 2 is required']
  },
  sportType: {
    type: String,
    required: [true, 'Sport type is required'],
    enum: ['cricket', 'throwball']
  },
  matchType: {
    type: String,
    enum: ['league', 'knockout', 'final'],
    default: 'league'
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true,
    maxlength: [100, 'Venue name cannot exceed 100 characters']
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  scheduledTime: {
    type: String,
    required: [true, 'Scheduled time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format']
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'postponed', 'cancelled'],
    default: 'scheduled'
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  },
  result: {
    type: String,
    enum: ['team1', 'team2', 'tied', 'no-result'],
    default: null
  },
  scores: {
    team1: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    team2: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  highlights: {
    type: String,
    maxlength: [500, 'Highlights cannot exceed 500 characters']
  },
  manOfTheMatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    default: null
  },
  umpires: [{
    name: {
      type: String,
      required: true,
      trim: true
    }
  }],
  referee: {
    name: {
      type: String,
      trim: true
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
matchSchema.index({ sportType: 1, status: 1 });
matchSchema.index({ scheduledDate: 1, status: 1 });
matchSchema.index({ team1: 1, team2: 1 });
matchSchema.index({ winner: 1 });

// Virtual for match display name
matchSchema.virtual('matchName').get(function() {
  return `${this.team1?.shortCode || 'Team 1'} vs ${this.team2?.shortCode || 'Team 2'}`;
});

// Method to set cricket scores
matchSchema.methods.setCricketScores = function(team1Score, team2Score) {
  this.scores.team1 = team1Score;
  this.scores.team2 = team2Score;
  
  // Determine winner based on runs
  if (team1Score.teamRuns > team2Score.teamRuns) {
    this.winner = this.team1;
    this.result = 'team1';
  } else if (team2Score.teamRuns > team1Score.teamRuns) {
    this.winner = this.team2;
    this.result = 'team2';
  } else {
    this.result = 'tied';
    this.winner = null;
  }
  
  this.status = 'completed';
};

// Method to set throwball scores
matchSchema.methods.setThrowballScores = function(team1Score, team2Score) {
  this.scores.team1 = team1Score;
  this.scores.team2 = team2Score;
  
  // Determine winner based on sets won
  if (team1Score.setsWon > team2Score.setsWon) {
    this.winner = this.team1;
    this.result = 'team1';
  } else if (team2Score.setsWon > team1Score.setsWon) {
    this.winner = this.team2;
    this.result = 'team2';
  } else {
    this.result = 'tied';
    this.winner = null;
  }
  
  this.status = 'completed';
};

// Pre-save middleware to populate team details
matchSchema.pre(['find', 'findOne'], function() {
  this.populate([
    { path: 'team1', select: 'name shortCode logo' },
    { path: 'team2', select: 'name shortCode logo' },
    { path: 'winner', select: 'name shortCode logo' }
  ]);
});

module.exports = mongoose.model('Match', matchSchema);
