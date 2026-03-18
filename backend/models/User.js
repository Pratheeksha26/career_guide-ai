const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    educationLevel: {
        type: String,
        default: 'undergraduate'
    },
    careerInterests: {
        type: [String],
        default: []
    },
    skills: {
        type: [String],
        default: []
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Remove password when converting to JSON
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
