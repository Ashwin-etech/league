const { validationResult } = require('express-validator');
const Match = require('../models/Match');
const Team = require('../models/Team');

const getAllMatches = async (req, res) => {
  try {
    const { sportType, status, page = 1, limit = 10, upcoming } = req.query;
    
    const query = {};
    if (sportType) query.sportType = sportType;
    if (status) query.status = status;
    
    // Filter for upcoming matches
    if (upcoming === 'true') {
      query.status = 'scheduled';
      query.scheduledDate = { $gte: new Date() };
    }

    const matches = await Match.find(query)
      .populate([
        { path: 'team1', select: 'name shortCode logo' },
        { path: 'team2', select: 'name shortCode logo' },
        { path: 'winner', select: 'name shortCode logo' }
      ])
      .sort({ scheduledDate: 1, scheduledTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Match.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        matches,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching matches'
    });
  }
};

const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate([
        { path: 'team1', select: 'name shortCode logo players' },
        { path: 'team2', select: 'name shortCode logo players' },
        { path: 'winner', select: 'name shortCode logo' }
      ]);
    
    if (!match) {
      return res.status(404).json({
        status: 'error',
        message: 'Match not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        match
      }
    });
  } catch (error) {
    console.error('Get match error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching match'
    });
  }
};

const createMatch = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { team1, team2, sportType, venue, scheduledDate, scheduledTime } = req.body;

    // Verify teams exist and belong to same sport type
    const [team1Doc, team2Doc] = await Promise.all([
      Team.findById(team1),
      Team.findById(team2)
    ]);

    if (!team1Doc || !team2Doc) {
      return res.status(400).json({
        status: 'error',
        message: 'One or both teams not found'
      });
    }

    if (team1Doc.sportType !== sportType || team2Doc.sportType !== sportType) {
      return res.status(400).json({
        status: 'error',
        message: 'Teams must belong to the specified sport type'
      });
    }

    if (team1.equals(team2)) {
      return res.status(400).json({
        status: 'error',
        message: 'Team cannot play against itself'
      });
    }

    const match = new Match(req.body);
    await match.save();

    const populatedMatch = await Match.findById(match._id)
      .populate([
        { path: 'team1', select: 'name shortCode logo' },
        { path: 'team2', select: 'name shortCode logo' }
      ]);

    res.status(201).json({
      status: 'success',
      message: 'Match created successfully',
      data: {
        match: populatedMatch
      }
    });
  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating match'
    });
  }
};

const updateMatch = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({
        status: 'error',
        message: 'Match not found'
      });
    }

    // Prevent updating completed matches
    if (match.status === 'completed') {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot update completed matches'
      });
    }

    Object.assign(match, req.body);
    await match.save();

    const populatedMatch = await Match.findById(match._id)
      .populate([
        { path: 'team1', select: 'name shortCode logo' },
        { path: 'team2', select: 'name shortCode logo' },
        { path: 'winner', select: 'name shortCode logo' }
      ]);

    res.json({
      status: 'success',
      message: 'Match updated successfully',
      data: {
        match: populatedMatch
      }
    });
  } catch (error) {
    console.error('Update match error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating match'
    });
  }
};

const updateMatchResult = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({
        status: 'error',
        message: 'Match not found'
      });
    }

    const { sportType, scores } = req.body;

    if (sportType === 'cricket') {
      match.setCricketScores(scores.team1, scores.team2);
      
      // Update team statistics
      const team1Result = {
        result: match.result === 'team1' ? 'won' : match.result === 'team2' ? 'lost' : 'tied',
        runsScored: scores.team1.teamRuns,
        runsConceded: scores.team2.teamRuns,
        oversPlayed: scores.team1.teamOvers,
        oversBowled: scores.team2.teamOvers
      };
      
      const team2Result = {
        result: match.result === 'team2' ? 'won' : match.result === 'team1' ? 'lost' : 'tied',
        runsScored: scores.team2.teamRuns,
        runsConceded: scores.team1.teamRuns,
        oversPlayed: scores.team2.teamOvers,
        oversBowled: scores.team1.teamOvers
      };

      await Promise.all([
        Team.findByIdAndUpdate(match.team1, { $push: { matches: match._id } }),
        Team.findByIdAndUpdate(match.team2, { $push: { matches: match._id } }),
        (await Team.findById(match.team1)).updateStats(team1Result),
        (await Team.findById(match.team2)).updateStats(team2Result)
      ]);
      
    } else if (sportType === 'throwball') {
      match.setThrowballScores(scores.team1, scores.team2);
      
      // Update team statistics
      const team1Result = {
        result: match.result === 'team1' ? 'won' : match.result === 'team2' ? 'lost' : 'tied'
      };
      
      const team2Result = {
        result: match.result === 'team2' ? 'won' : match.result === 'team1' ? 'lost' : 'tied'
      };

      await Promise.all([
        Team.findByIdAndUpdate(match.team1, { $push: { matches: match._id } }),
        Team.findByIdAndUpdate(match.team2, { $push: { matches: match._id } }),
        (await Team.findById(match.team1)).updateStats(team1Result),
        (await Team.findById(match.team2)).updateStats(team2Result)
      ]);
    }

    await match.save();

    const populatedMatch = await Match.findById(match._id)
      .populate([
        { path: 'team1', select: 'name shortCode logo' },
        { path: 'team2', select: 'name shortCode logo' },
        { path: 'winner', select: 'name shortCode logo' }
      ]);

    res.json({
      status: 'success',
      message: 'Match result updated successfully',
      data: {
        match: populatedMatch
      }
    });
  } catch (error) {
    console.error('Update match result error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating match result'
    });
  }
};

const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({
        status: 'error',
        message: 'Match not found'
      });
    }

    // Only allow deletion of scheduled matches
    if (match.status !== 'scheduled') {
      return res.status(400).json({
        status: 'error',
        message: 'Can only delete scheduled matches'
      });
    }

    await Match.findByIdAndDelete(req.params.id);

    res.json({
      status: 'success',
      message: 'Match deleted successfully'
    });
  } catch (error) {
    console.error('Delete match error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting match'
    });
  }
};

module.exports = {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  updateMatchResult,
  deleteMatch
};
