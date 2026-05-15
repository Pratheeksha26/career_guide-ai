const groqService = require('../services/groqService');
const careerDataService = require('../services/careerDataService');
const ChatSession = require('../models/ChatSession');
const fileService = require('../services/fileService');

class ChatController {
    // Main chat handler
    async sendMessage(req, res) {
        try {
            const {
                message,
                sessionId,
                conversationHistory = []
            } = req.body;

            if (!message || message.trim() === '') {
                return res.status(400).json({
                    success: false,
                    error: 'Message is required',
                    response: 'Please ask a career-related question.',
                    timestamp: new Date().toISOString()
                });
            }

            console.log(`📨 Chat request from user ${req.userId}: ${message.substring(0, 50)}...`);

            let enrichedMessage = message;
            let fileMetadata = [];
            
            // 🆕 Handle file uploads
            if (req.files && req.files.length > 0) {
                console.log(`📎 Processing ${req.files.length} attached file(s)...`);
                
                fileMetadata = req.files.map(f => ({
                    originalname: f.originalname,
                    mimetype: f.mimetype,
                    size: f.size,
                    filename: f.filename,
                    path: f.path
                }));

                const extractedTextPromises = req.files.map(file => fileService.extractText(file));
                const results = await Promise.all(extractedTextPromises);
                
                results.forEach((text, i) => {
                    console.log(`📄 File: ${req.files[i].originalname}, Type: ${req.files[i].mimetype}, Extracted length: ${text.length}`);
                    if (text.length < 50) {
                        console.warn(`⚠️ Warning: Very short text extracted from ${req.files[i].originalname}. Likely a scanned document.`);
                    }
                });

                const attachmentsContext = results
                    .map((text, index) => `\n--- START OF ATTACHMENT: ${req.files[index].originalname} ---\n${text}\n--- END OF ATTACHMENT: ${req.files[index].originalname} ---\n`)
                    .join('\n');
                
                enrichedMessage = `[User uploaded ${req.files.length} document(s). Use the content below to answer their question if relevant.]\n\n${attachmentsContext}\n\nUSER QUESTION: ${message}`;
                
                console.log(`✅ Extracted ${attachmentsContext.length} characters from attachments.`);
            }

            // Use AI service
            const response = await groqService.getResponse(enrichedMessage, conversationHistory);
            const source = 'groq';

            // Format the response
            const formattedResponse = this.formatCareerResponse(response);

            // Save message to session
            if (sessionId) {
                await this.saveMessageToSession(req.userId, sessionId, message, formattedResponse, source, fileMetadata);
            }

            res.json({
                success: true,
                response: formattedResponse,
                source,
                timestamp: new Date().toISOString(),
                suggestions: this.generateSuggestions(message)
            });

        } catch (error) {
            console.error('💥 Chat error:', error);
            res.status(500).json({
                success: false,
                error: 'AI service failed. Please try again later.',
                timestamp: new Date().toISOString()
            });
        }
    }

    // Create new chat session
    async createSession(req, res) {
        try {
            const userId = req.userId;
            const { title = 'New Chat' } = req.body;

            const session = await ChatSession.create({
                userId,
                title,
                messages: []
            });
            res.json({
                success: true,
                session: session.toJSON()
            });
        } catch (error) {
            console.error('❌ Create session error:', error);
            res.status(500).json({ success: false, error: 'Failed to create session' });
        }
    }

    // Get all sessions for user
    async getSessions(req, res) {
        try {
            const userId = req.userId;

            const sessions = await ChatSession.findAll({ 
                where: { userId },
                attributes: ['id', 'title', 'messageCount', 'lastMessage', 'updatedAt'],
                order: [['updatedAt', 'DESC']],
                limit: 20
            });

            res.json({ success: true, sessions });
        } catch (error) {
            console.error('❌ Get sessions error:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch sessions' });
        }
    }

    // Get specific session with messages
    async getSession(req, res) {
        try {
            const userId = req.userId;
            const sessionId = req.params.id;

            const session = await ChatSession.findOne({ 
                where: { id: sessionId, userId } 
            });

            if (!session) {
                return res.status(404).json({ success: false, error: 'Session not found' });
            }

            res.json({
                success: true,
                session: session.toJSON()
            });
        } catch (error) {
            console.error('❌ Get session error:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch session' });
        }
    }

    // Delete session
    async deleteSession(req, res) {
        try {
            const userId = req.userId;
            const sessionId = req.params.id;

            const result = await ChatSession.destroy({ 
                where: { id: sessionId, userId } 
            });

            if (result === 0) {
                return res.status(404).json({ success: false, error: 'Session not found' });
            }

            res.json({ success: true, message: 'Session deleted' });
        } catch (error) {
            console.error('❌ Delete session error:', error);
            res.status(500).json({ success: false, error: 'Failed to delete session' });
        }
    }

    // Save message to session — also updates title if still default
    async saveMessageToSession(userId, sessionId, userMessage, botResponse, source, files = []) {
        try {
            const session = await ChatSession.findOne({ 
                where: { id: sessionId, userId } 
            });

            if (!session) {
                console.warn(`⚠️ Session ${sessionId} not found for user ${userId}`);
                return;
            }

            // Add user and bot messages
            const currentMessages = Array.isArray(session.messages) ? [...session.messages] : [];
            
            currentMessages.push({
                id: Date.now(),
                text: userMessage || (files.length > 0 ? `📁 Shared ${files.length} file(s)` : ''),
                sender: 'user',
                timestamp: new Date(),
                files: files
            });
            
            currentMessages.push({
                id: Date.now() + 1,
                text: botResponse,
                sender: 'bot',
                timestamp: new Date(),
                source
            });

            session.messages = currentMessages;

            // Auto-update title from first user message if still default
            if (!session.title || session.title === 'New Chat') {
                const maxLen = 50;
                let newTitle = userMessage.trim();
                if (newTitle.length > maxLen) {
                    const cut = newTitle.substring(0, maxLen);
                    const lastSpace = cut.lastIndexOf(' ');
                    newTitle = (lastSpace > 0 ? cut.substring(0, lastSpace) : cut) + '...';
                }
                session.title = newTitle;
            }

            session.changed('messages', true);
            await session.save();
        } catch (error) {
            console.error('⚠️ Failed to save message:', error);
        }
    }


    formatCareerResponse(response) {
        return response || 'No response generated.';
    }

    generateSuggestions() {
        return [
            'Take career aptitude test',
            'Research top companies',
            'Connect with alumni',
            'Build relevant skills'
        ];
    }

    // Get chat history (legacy)
    async getChatHistory(req, res) {
        try {
            const userId = req.userId;
            const chats = await ChatSession.findAll({ 
                where: { userId },
                attributes: ['id', 'title', 'messageCount', 'updatedAt'],
                order: [['updatedAt', 'DESC']]
            });
            
            res.json({
                success: true,
                chats,
                count: chats.length
            });
        } catch (error) {
            console.error('💥 Get chat history error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch chat history'
            });
        }
    }

    // Delete chat (legacy)
    async deleteChat(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            
            await ChatSession.destroy({ 
                where: { id: id, userId } 
            });
            
            res.json({
                success: true,
                message: 'Chat deleted successfully'
            });
        } catch (error) {
            console.error('💥 Delete chat error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to delete chat'
            });
        }
    }

    // Save chat session (legacy)
    async saveChatSession(req, res) {
        try {
            const { messages, sessionName } = req.body;
            const userId = req.userId;
            
            const session = await ChatSession.create({
                userId,
                title: sessionName,
                messages
            });
            
            res.json({
                success: true,
                message: 'Chat session saved successfully',
                sessionId: session._id
            });
        } catch (error) {
            console.error('💥 Save chat session error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to save chat session'
            });
        }
    }

    async getQuickAnswers(req, res) {
        const answers = careerDataService.getQuickAnswers(req.params.category);
        res.json(answers);
    }
}

const chatController = new ChatController();

module.exports = {
    sendMessage: chatController.sendMessage.bind(chatController),
    getChatHistory: chatController.getChatHistory.bind(chatController),
    deleteChat: chatController.deleteChat.bind(chatController),
    saveChatSession: chatController.saveChatSession.bind(chatController),
    getQuickAnswers: chatController.getQuickAnswers.bind(chatController),
    createSession: chatController.createSession.bind(chatController),
    getSessions: chatController.getSessions.bind(chatController),
    getSession: chatController.getSession.bind(chatController),
    deleteSession: chatController.deleteSession.bind(chatController)
};
