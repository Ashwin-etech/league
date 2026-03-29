const { validationResult } = require('express-validator');
const Team = require('../models/Team');

const getAllTeams = async (req, res) => {
  try {
    const { sportType, page = 1, limit = 10, search } = req.query;
    
    const query = { isActive: true };
    if (sportType) query.sportType = sportType;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortCode: { $regex: search, $options: 'i' } }
      ];
    }

    const teams = await Team.find(query)
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Team.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        teams,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching teams'
    });
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team || !team.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        team
      }
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching team'
    });
  }
};

const createTeam = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const teamData = req.body;
    
    // Check if team with same name or shortCode already exists
    const existingTeam = await Team.findOne({
      $or: [
        { name: teamData.name },
        { shortCode: teamData.shortCode }
      ]
    });

    if (existingTeam) {
      return res.status(400).json({
        status: 'error',
        message: 'Team with this name or short code already exists'
      });
    }

    const team = new Team(teamData);
    await team.save();

    res.status(201).json({
      status: 'success',
      message: 'Team created successfully',
      data: {
        team
      }
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating team'
    });
  }
};

const updateTeam = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found'
      });
    }

    // Check if updating name or shortCode to existing values
    const { name, shortCode } = req.body;
    if (name && name !== team.name) {
      const existingTeam = await Team.findOne({ name });
      if (existingTeam) {
        return res.status(400).json({
          status: 'error',
          message: 'Team with this name already exists'
        });
      }
    }

    if (shortCode && shortCode !== team.shortCode) {
      const existingTeam = await Team.findOne({ shortCode });
      if (existingTeam) {
        return res.status(400).json({
          status: 'error',
          message: 'Team with this short code already exists'
        });
      }
    }

    Object.assign(team, req.body);
    await team.save();

    res.json({
      status: 'success',
      message: 'Team updated successfully',
      data: {
        team
      }
    });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating team'
    });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found'
      });
    }

    // Soft delete - set isActive to false
    team.isActive = false;
    await team.save();

    res.json({
      status: 'success',
      message: 'Team deleted successfully'
    });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting team'
    });
  }
};

const addPlayer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found'
      });
    }

    // Check if jersey number already exists
    const { jerseyNumber } = req.body;
    const existingPlayer = team.players.find(
      player => player.jerseyNumber === jerseyNumber
    );

    if (existingPlayer) {
      return res.status(400).json({
        status: 'error',
        message: 'Player with this jersey number already exists in the team'
      });
    }

    team.players.push(req.body);
    await team.save();

    res.json({
      status: 'success',
      message: 'Player added successfully',
      data: {
        team
      }
    });
  } catch (error) {
    console.error('Add player error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while adding player'
    });
  }
};

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addPlayer
};
