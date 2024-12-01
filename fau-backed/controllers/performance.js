// controllers/performanceController.js

const PerformanceEvaluation = require('../models/performance');

// Function to handle performance evaluation submission
exports.submitEvaluation = async (req, res) => {
    const { fname,lname,email, znumber, teachingQuality, communicationSkills, comments } = req.body;

    try {
        // Create a new evaluation record
        const newEvaluation = new PerformanceEvaluation({
            fname,
            lname,
            email,
            znumber,
            teachingQuality,
            communicationSkills,
            comments,
            createdAt: new Date(),
        });

        // Save the evaluation to the database
        await newEvaluation.save();
        res.status(200).json({ message: 'Evaluation submitted successfully!' });
    } catch (error) {
        console.error('Error submitting performance evaluation:', error);
        res.status(500).json({ message: 'Failed to submit evaluation' });
    }
};

exports.ListPerformances = async (req, res) => {
    try {
        const evaluations = await PerformanceEvaluation.find(); // Fetch all performance evaluations
        res.json(evaluations); // Send the evaluations as a JSON response
    } catch (err) {
        res.status(400).send("Error fetching evaluations"); // Send error message if something goes wrong
    }
};