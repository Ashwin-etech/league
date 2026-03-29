const Team = require('../models/Team');

const getLeaderboard = async (req, res) => {
  try {
    const { sportType, page = 1, limit = 10 } = req.query;
    
    if (!sportType || !['cricket', 'throwball'].includes(sportType)) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid sport type (cricket or throwball) is required'
      });
    }

    const query = { sportType, isActive: true };
    
    const teams = await Team.find(query)
      .sort({ 
        'stats.points': -1, 
        'stats.netRunRate': sportType === 'cricket' ? -1 : 0,
        'stats.matchesWon': -1,
        name: 1 
      })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Team.countDocuments(query);

    // Add position and additional calculated fields
    const leaderboard = teams.map((team, index) => {
      const teamObj = team.toObject();
      const position = (page - 1) * limit + index + 1;
      
      // Calculate win percentage
      const winPercentage = team.stats.matchesPlayed > 0 
        ? ((team.stats.matchesWon / team.stats.matchesPlayed) * 100).toFixed(2)
        : '0.00';

      // Calculate form (last 5 matches - placeholder for now)
      const form = team.stats.matchesPlayed > 0 
        ? Array(Math.min(5, team.stats.matchesPlayed)).fill('W').slice(0, team.stats.matchesWon)
          .concat(Array(Math.min(5, team.stats.matchesPlayed)).fill('L').slice(0, team.stats.matchesLost))
        : [];

      return {
        ...teamObj,
        position,
        winPercentage,
        form: form.slice(0, 5)
      };
    });

    res.json({
      status: 'success',
      data: {
        leaderboard,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching leaderboard'
    });
  }
};

const getTeamStats = async (req, res) => {
  try {
    const { teamId } = req.params;
    
    const team = await Team.findById(teamId).populate('matches');
    
    if (!team || !team.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found'
      });
    }

    // Calculate detailed statistics
    const stats = {
      ...team.stats,
      winPercentage: team.stats.matchesPlayed > 0 
        ? ((team.stats.matchesWon / team.stats.matchesPlayed) * 100).toFixed(2)
        : '0.00',
      averageRunsPerMatch: team.sportType === 'cricket' && team.stats.matchesPlayed > 0
        ? (team.stats.totalRunsScored / team.stats.matchesPlayed).toFixed(2)
        : null,
      averageRunsConcededPerMatch: team.sportType === 'cricket' && team.stats.matchesPlayed > 0
        ? (team.stats.totalRunsConceded / team.stats.matchesPlayed).toFixed(2)
        : null,
      strikeRate: team.sportType === 'cricket' && team.stats.totalOversPlayed > 0
        ? ((team.stats.totalRunsScored / team.stats.totalOversPlayed) * 6).toFixed(2)
        : null,
      economyRate: team.sportType === 'cricket' && team.stats.totalOversBowled > 0
        ? (team.stats.totalRunsConceded / team.stats.totalOversBowled).toFixed(2)
        : null
    };

    res.json({
      status: 'success',
      data: {
        team,
        stats
      }
    });
  } catch (error) {
    console.error('Get team stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching team statistics'
    });
  }
};

const getTopPerformers = async (req, res) => {
  try {
    const { sportType, category = 'points', limit = 5 } = req.query;
    
    if (!sportType || !['cricket', 'throwball'].includes(sportType)) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid sport type (cricket or throwball) is required'
      });
    }

    const query = { sportType, isActive: true };
    
    let sortCriteria = {};
    
    switch (category) {
      case 'points':
        sortCriteria = { 'stats.points': -1 };
        break;
      case 'wins':
        sortCriteria = { 'stats.matchesWon': -1 };
        break;
      case 'nrr':
        if (sportType === 'cricket') {
          sortCriteria = { 'stats.netRunRate': -1 };
        } else {
          sortCriteria = { 'stats.points': -1 };
        }
        break;
      case 'runs':
        if (sportType === 'cricket') {
          sortCriteria = { 'stats.totalRunsScored': -1 };
        } else {
          sortCriteria = { 'stats.points': -1 };
        }
        break;
      default:
        sortCriteria = { 'stats.points': -1 };
    }

    const teams = await Team.find(query)
      .sort(sortCriteria)
      .limit(parseInt(limit));

    const topPerformers = teams.map((team, index) => ({
      ...team.toObject(),
      rank: index + 1,
      categoryValue: category === 'points' ? team.stats.points :
                     category === 'wins' ? team.stats.matchesWon :
                     category === 'nrr' ? team.stats.netRunRate :
                     category === 'runs' ? team.stats.totalRunsScored :
                     team.stats.points
    }));

    res.json({
      status: 'success',
      data: {
        category,
        topPerformers
      }
    });
  } catch (error) {
    console.error('Get top performers error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching top performers'
    });
  }
};

module.exports = {
  getLeaderboard,
  getTeamStats,
  getTopPerformers
};
