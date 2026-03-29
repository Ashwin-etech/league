const express = require('express');
const { body, param } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addPlayer
} = require('../controllers/teamController');

const router = express.Router();

// Validation rules
const teamValidation = [
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Team name must be between 2 and 50 characters')
    .trim(),
  body('shortCode')
    .isLength({ min: 2, max: 4 })
    .withMessage('Short code must be between 2 and 4 characters')
    .matches(/^[A-Z]+$/)
    .withMessage('Short code must contain only uppercase letters'),
  body('sportType')
    .isIn(['cricket', 'throwball'])
    .withMessage('Sport type must be either cricket or throwball'),
  body('homeGround')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Home ground name cannot exceed 100 characters')
    .trim(),
  body('foundedYear')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage('Founded year must be valid')
];

const playerValidation = [
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Player name must be between 2 and 50 characters')
    .trim(),
  body('jerseyNumber')
    .isInt({ min: 1, max: 99 })
    .withMessage('Jersey number must be between 1 and 99'),
  body('role')
    .optional()
    .isIn(['batsman', 'bowler', 'all-rounder', 'wicket-keeper', 'player'])
    .withMessage('Invalid player role')
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid team ID')
];

// Routes
router.get('/', getAllTeams);
router.get('/:id', idValidation, getTeamById);

// Protected routes (require authentication)
router.post('/', auth, adminAuth, teamValidation, createTeam);
router.put('/:id', auth, adminAuth, idValidation, teamValidation, updateTeam);
router.delete('/:id', auth, adminAuth, idValidation, deleteTeam);
router.post('/:id/players', auth, adminAuth, idValidation, playerValidation, addPlayer);

module.exports = router;
