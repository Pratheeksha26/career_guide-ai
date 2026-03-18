const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        default: 'New Chat'
    },
    messages: [{
        id: Number,
        text: String,
        sender: {
            type: String,
            enum: ['user', 'bot']
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        source: String,
        files: [{
            originalname: String,
            mimetype: String,
            size: Number,
            filename: String,
            path: String
        }]
    }],
    messageCount: {
        type: Number,
        default: 0
    },
    lastMessage: {
        type: String
    }
}, {
    timestamps: true
});

// Update messageCount before saving
chatSessionSchema.pre('save', function() {
    if (this.messages) {
        this.messageCount = this.messages.length;
        if (this.messages.length > 0) {
            const lastMsg = this.messages[this.messages.length - 1];
            // Update lastMessage preview
            this.lastMessage = lastMsg.text ? lastMsg.text.substring(0, 100) : '';
        }
    }
});

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
module.exports = ChatSession;
