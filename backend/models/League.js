const mongoose = require('mongoose');

const leagueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'League name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'League name cannot exceed 100 characters']
  },
  shortCode: {
    type: String,
    required: [true, 'League short code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    minlength: [2, 'Short code must be at least 2 characters'],
    maxlength: [10, 'Short code cannot exceed 10 characters']
  },
  sportType: {
    type: String,
    required: [true, 'Sport type is required'],
    enum: ['cricket', 'throwball']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  logo: {
    type: String,
    default: ''
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  format: {
    type: String,
    enum: ['t20', 'odi', 'test', 'custom'],
    default: 't20'
  },
  maxOvers: {
    type: Number,
    default: 20,
    min: 1,
    max: 50
  },
  pointsSystem: {
    win: {
      type: Number,
      default: 2
    },
    tie: {
      type: Number,
      default: 1
    },
    loss: {
      type: Number,
      default: 0
    }
  },
  rules: {
    type: String,
    maxlength: [1000, 'Rules cannot exceed 1000 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
leagueSchema.index({ sportType: 1, status: 1 });
leagueSchema.index({ startDate: 1, endDate: 1 });

// Validation for end date being after start date
leagueSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  } else {
    next();
  }
});

// Virtual for league duration
leagueSchema.virtual('duration').get(function() {
  const diffTime = Math.abs(this.endDate - this.startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to add team to league
leagueSchema.methods.addTeam = async function(teamId) {
  if (!this.teams.includes(teamId)) {
    this.teams.push(teamId);
    return await this.save();
  }
  return this;
};

// Method to remove team from league
leagueSchema.methods.removeTeam = async function(teamId) {
  this.teams = this.teams.filter(team => !team.equals(teamId));
  return await this.save();
};

// Method to get league standings
leagueSchema.methods.getStandings = async function() {
  const Team = mongoose.model('Team');
  const teams = await Team.find({
    _id: { $in: this.teams },
    sportType: this.sportType,
    isActive: true
  }).sort({ 'stats.points': -1, 'stats.netRunRate': -1 });
  
  return teams.map((team, index) => ({
    ...team.toObject(),
    position: index + 1
  }));
};

module.exports = mongoose.model('League', leagueSchema);
