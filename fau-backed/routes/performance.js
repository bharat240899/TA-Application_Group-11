

const express = require('express');
const router = express.Router();
const { submitEvaluation ,ListPerformances} = require('../controllers/performance'); 

// POST route for submitting performance evaluations
router.post('/performance-evaluation', submitEvaluation);
router.get('/ta-evaluations', ListPerformances);

module.exports = router;
