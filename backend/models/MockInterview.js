const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MockInterview = sequelize.define('MockInterview', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    jobRole: {
        type: DataTypes.STRING,
        allowNull: false
    },
    questions: {
        type: DataTypes.JSONB,
        defaultValue: []
    },
    overallScores: {
        type: DataTypes.JSONB,
        defaultValue: {
            answerQuality: 0,
            confidence: 0,
            posture: 0,
            attire: 0,
            overall: 0
        }
    },
    generalFeedback: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.ENUM('in-progress', 'completed'),
        defaultValue: 'completed'
    }
}, {
    timestamps: true
});

// Compatibility for frontend
MockInterview.prototype.toJSON = function() {
    const values = { ...this.get() };
    values._id = values.id;
    return values;
};

module.exports = MockInterview;
