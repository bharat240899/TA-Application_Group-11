// models/PerformanceEvaluation.js

const mongoose = require('mongoose');

const performanceEvaluationSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true },
    znumber: { type: String, required: true },
    teachingQuality: { type: Number, required: true },
    communicationSkills: { type: Number, required: true },
    comments: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const PerformanceEvaluation = mongoose.model('performance', performanceEvaluationSchema);

module.exports = PerformanceEvaluation;
