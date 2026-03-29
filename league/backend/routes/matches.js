const express = require('express');
const { body, param } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  updateMatchResult,
  deleteMatch
} = require('../controllers/matchController');

const router = express.Router();

// Validation rules
const matchValidation = [
  body('team1')
    .isMongoId()
    .withMessage('Invalid team 1 ID'),
  body('team2')
    .isMongoId()
    .withMessage('Invalid team 2 ID'),
  body('sportType')
    .isIn(['cricket', 'throwball'])
    .withMessage('Sport type must be either cricket or throwball'),
  body('venue')
    .isLength({ min: 2, max: 100 })
    .withMessage('Venue must be between 2 and 100 characters')
    .trim(),
  body('scheduledDate')
    .isISO8601()
    .withMessage('Invalid scheduled date'),
  body('scheduledTime')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Time must be in HH:MM format'),
  body('matchType')
    .optional()
    .isIn(['league', 'knockout', 'final'])
    .withMessage('Invalid match type')
];

const cricketScoreValidation = [
  body('scores.team1.teamRuns')
    .isInt({ min: 0 })
    .withMessage('Team 1 runs must be a non-negative integer'),
  body('scores.team1.teamWickets')
    .isInt({ min: 0, max: 10 })
    .withMessage('Team 1 wickets must be between 0 and 10'),
  body('scores.team1.teamOvers')
    .isFloat({ min: 0 })
    .withMessage('Team 1 overs must be a non-negative number'),
  body('scores.team2.teamRuns')
    .isInt({ min: 0 })
    .withMessage('Team 2 runs must be a non-negative integer'),
  body('scores.team2.teamWickets')
    .isInt({ min: 0, max: 10 })
    .withMessage('Team 2 wickets must be between 0 and 10'),
  body('scores.team2.teamOvers')
    .isFloat({ min: 0 })
    .withMessage('Team 2 overs must be a non-negative number')
];

const throwballScoreValidation = [
  body('scores.team1.teamPoints')
    .isInt({ min: 0 })
    .withMessage('Team 1 points must be a non-negative integer'),
  body('scores.team1.setsWon')
    .isInt({ min: 0 })
    .withMessage('Team 1 sets won must be a non-negative integer'),
  body('scores.team2.teamPoints')
    .isInt({ min: 0 })
    .withMessage('Team 2 points must be a non-negative integer'),
  body('scores.team2.setsWon')
    .isInt({ min: 0 })
    .withMessage('Team 2 sets won must be a non-negative integer')
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid match ID')
];

// Routes
router.get('/', getAllMatches);
router.get('/upcoming', getAllMatches); // Will be filtered by query param
router.get('/:id', idValidation, getMatchById);

// Protected routes (require authentication)
router.post('/', auth, adminAuth, matchValidation, createMatch);
router.put('/:id', auth, adminAuth, idValidation, matchValidation, updateMatch);
router.patch('/:id/result', auth, adminAuth, idValidation, (req, res, next) => {
  // Validate based on sport type
  if (req.body.sportType === 'cricket') {
    return cricketScoreValidation(req, res, next);
  } else if (req.body.sportType === 'throwball') {
    return throwballScoreValidation(req, res, next);
  }
  next();
}, updateMatchResult);
router.delete('/:id', auth, adminAuth, idValidation, deleteMatch);

module.exports = router;
