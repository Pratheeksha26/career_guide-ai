const express = require('express');
const router = express.Router();
const studyController = require('../controllers/studyController');

// Study materials endpoints
router.get('/materials/:category', studyController.getStudyMaterials);
router.get('/aptitude/questions', studyController.getAptitudeQuestions);
router.get('/aptitude/tests', studyController.getMockTests);
router.get('/company-data/:company', studyController.getCompanyData);

module.exports = router;