const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatSession = sequelize.define('ChatSession', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        defaultValue: 'New Chat'
    },
    messages: {
        type: DataTypes.JSONB,
        defaultValue: []
    },
    messageCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lastMessage: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true
});

// Update messageCount and lastMessage preview before save
ChatSession.addHook('beforeSave', (session) => {
    if (session.messages && Array.isArray(session.messages)) {
        session.messageCount = session.messages.length;
        if (session.messages.length > 0) {
            const lastMsg = session.messages[session.messages.length - 1];
            session.lastMessage = lastMsg.text ? lastMsg.text.substring(0, 100) : '';
        }
    }
});

// Compatibility for frontend
ChatSession.prototype.toJSON = function() {
    const values = { ...this.get() };
    values._id = values.id;
    return values;
};

module.exports = ChatSession;
