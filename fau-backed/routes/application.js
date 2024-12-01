const express = require('express');
const multer = require('multer');
const router = express.Router();

const { createApplicationForCourse,updateApplicationStatus, listApplications, sendUpdate } = require('../controllers/application');
const { requireSignin, isAuth } = require('../controllers/auth');

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create an application for a course
router.post(
    '/courses/:courseId/applications',
    requireSignin,
    isAuth, // Ensure user is authenticated and authorized
    upload.single('resume'),
    createApplicationForCourse,
);
router.put('/courses/:applicationId/applications', updateApplicationStatus);

// List all applications for a course
// Route to list all applications
router.get('/applications', listApplications);

router.post('/notifystatus', sendUpdate);

module.exports = router;
