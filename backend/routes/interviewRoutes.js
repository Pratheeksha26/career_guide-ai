const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Apply auth middleware to all interview routes
router.use(authMiddleware);

// Get interview questions
router.get('/questions', (req, res) => interviewController.getQuestions(req, res));

// Submit interview results
router.post('/submit', (req, res) => interviewController.submitInterview(req, res));

// Get interview history
router.get('/history', (req, res) => interviewController.getHistory(req, res));

module.exports = router;
