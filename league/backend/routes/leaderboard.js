const express = require('express');
const { param, query } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  getLeaderboard,
  getTeamStats,
  getTopPerformers
} = require('../controllers/leaderboardController');

const router = express.Router();

// Validation rules
const sportTypeValidation = [
  query('sportType')
    .isIn(['cricket', 'throwball'])
    .withMessage('Sport type must be either cricket or throwball')
];

const teamIdValidation = [
  param('teamId')
    .isMongoId()
    .withMessage('Invalid team ID')
];

const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
];

const categoryValidation = [
  query('category')
    .optional()
    .isIn(['points', 'wins', 'nrr', 'runs'])
    .withMessage('Category must be one of: points, wins, nrr, runs')
];

// Routes
router.get('/', sportTypeValidation, paginationValidation, getLeaderboard);
router.get('/top-performers', sportTypeValidation, categoryValidation, paginationValidation, getTopPerformers);
router.get('/team/:teamId', teamIdValidation, getTeamStats);

module.exports = router;
