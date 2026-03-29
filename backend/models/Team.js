const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Player name is required'],
    trim: true,
    maxlength: [50, 'Player name cannot exceed 50 characters']
  },
  jerseyNumber: {
    type: Number,
    min: [1, 'Jersey number must be at least 1'],
    max: [99, 'Jersey number cannot exceed 99']
  },
  role: {
    type: String,
    enum: ['batsman', 'bowler', 'all-rounder', 'wicket-keeper', 'player'],
    default: 'player'
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
    maxlength: [50, 'Team name cannot exceed 50 characters']
  },
  shortCode: {
    type: String,
    required: [true, 'Team short code is required'],
    uppercase: true,
    trim: true,
    minlength: [2, 'Short code must be at least 2 characters'],
    maxlength: [4, 'Short code cannot exceed 4 characters']
  },
  logo: {
    type: String,
    default: ''
  },
  sportType: {
    type: String,
    required: [true, 'Sport type is required'],
    enum: ['cricket', 'throwball']
  },
  players: [playerSchema],
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  homeGround: {
    type: String,
    trim: true,
    maxlength: [100, 'Home ground name cannot exceed 100 characters']
  },
  foundedYear: {
    type: Number,
    min: [1800, 'Founded year must be after 1800'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stats: {
    matchesPlayed: { type: Number, default: 0 },
    matchesWon: { type: Number, default: 0 },
    matchesLost: { type: Number, default: 0 },
    matchesTied: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    netRunRate: { type: Number, default: 0 },
    totalRunsScored: { type: Number, default: 0 },
    totalRunsConceded: { type: Number, default: 0 },
    totalOversPlayed: { type: Number, default: 0 },
    totalOversBowled: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Index for efficient queries
teamSchema.index({ sportType: 1, isActive: 1 });
teamSchema.index({ name: 'text', shortCode: 'text' });
// Compound unique indexes - same name/shortCode can exist for different sports
teamSchema.index({ name: 1, sportType: 1 }, { unique: true });
teamSchema.index({ shortCode: 1, sportType: 1 }, { unique: true });

// Virtual for win percentage
teamSchema.virtual('winPercentage').get(function() {
  if (this.stats.matchesPlayed === 0) return 0;
  return ((this.stats.matchesWon / this.stats.matchesPlayed) * 100).toFixed(2);
});

// Method to update team statistics
teamSchema.methods.updateStats = async function(matchResult) {
  const { result, runsScored = 0, runsConceded = 0, oversPlayed = 0, oversBowled = 0 } = matchResult;
  
  this.stats.matchesPlayed += 1;
  
  if (result === 'won') {
    this.stats.matchesWon += 1;
    this.stats.points += 2;
  } else if (result === 'lost') {
    this.stats.matchesLost += 1;
  } else if (result === 'tied') {
    this.stats.matchesTied += 1;
    this.stats.points += 1;
  }
  
  // Update cricket-specific stats
  if (this.sportType === 'cricket') {
    this.stats.totalRunsScored += runsScored;
    this.stats.totalRunsConceded += runsConceded;
    this.stats.totalOversPlayed += oversPlayed;
    this.stats.totalOversBowled += oversBowled;
    
    // Calculate Net Run Rate
    if (this.stats.totalOversPlayed > 0 && this.stats.totalOversBowled > 0) {
      const runRateFor = this.stats.totalRunsScored / this.stats.totalOversPlayed;
      const runRateAgainst = this.stats.totalRunsConceded / this.stats.totalOversBowled;
      this.stats.netRunRate = parseFloat((runRateFor - runRateAgainst).toFixed(4));
    }
  }
  
  return await this.save();
};

module.exports = mongoose.model('Team', teamSchema);
