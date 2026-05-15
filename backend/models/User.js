const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('student', 'admin'),
        defaultValue: 'student'
    },
    educationLevel: {
        type: DataTypes.STRING,
        defaultValue: 'undergraduate'
    },
    careerInterests: {
        type: DataTypes.JSONB,
        defaultValue: []
    },
    skills: {
        type: DataTypes.JSONB,
        defaultValue: []
    },
    lastLogin: {
        type: DataTypes.DATE
    },
    otp: {
        type: DataTypes.STRING
    },
    otpExpires: {
        type: DataTypes.DATE
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

// Compatibility method for frontend expecting MongoDB structure
User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    // Alias id to _id for frontend compatibility
    values._id = values.id;
    return values;
};

module.exports = User;
