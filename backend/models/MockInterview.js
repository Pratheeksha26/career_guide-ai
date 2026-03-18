const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    jobRole: {
        type: String,
        required: true
    },
    questions: [{
        question: String,
        userAnswer: String,
        feedback: String,
        score: Number
    }],
    overallScores: {
        answerQuality: { type: Number, default: 0 },
        confidence: { type: Number, default: 0 },
        posture: { type: Number, default: 0 },
        attire: { type: Number, default: 0 },
        overall: { type: Number, default: 0 }
    },
    generalFeedback: String,
    status: {
        type: String,
        enum: ['in-progress', 'completed'],
        default: 'completed'
    }
}, {
    timestamps: true
});

const MockInterview = mongoose.model('MockInterview', mockInterviewSchema);
module.exports = MockInterview;
