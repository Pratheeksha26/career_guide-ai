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

            // 1️⃣ Check for structured data first
            const structuredData = careerDataService.getCareerData(message);
            if (structuredData) {
                // Save message to session
                if (sessionId) {
                    await this.saveMessageToSession(req.userId, sessionId, message, structuredData.response, 'structured');
                }
                
                return res.json({
                    success: true,
                    response: structuredData.response,
                    sources: structuredData.sources,
                    suggestions: structuredData.suggestions,
                    isStructured: true,
                    source: 'structured',
                    timestamp: new Date().toISOString()
                });
            }

            let response;
            let source = 'groq';

            // 2️⃣ Use AI service
            try {
                response = await groqService.getResponse(enrichedMessage, conversationHistory);
                source = 'groq';
            } catch (aiError) {
                console.error('❌ AI service failed:', aiError);
                // Fallback to offline structured data
                const fallbackData = this.getFallbackResponse(message);
                return res.json({
                    success: true,
                    response: fallbackData,
                    source: 'fallback',
                    timestamp: new Date().toISOString(),
                    note: 'Using fallback response'
                });
            }

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
            
            // Final fallback to offline response
            const fallbackResponse = this.getFallbackResponse(req.body?.message || '');
            
            res.status(500).json({
                success: false,
                response: fallbackResponse,
                source: 'offline',
                timestamp: new Date().toISOString(),
                error: 'AI service failed'
            });
        }
    }

    // Create new chat session
    async createSession(req, res) {
        try {
            const userId = req.userId;
            const { title = 'New Chat' } = req.body;

            const session = new ChatSession({
                userId,
                title,
                messages: []
            });

            await session.save();
            res.json({
                success: true,
                session: {
                    _id: session._id,
                    user_id: session.userId,
                    title: session.title,
                    messages: [],
                    messageCount: 0,
                    createdAt: session.createdAt,
                    updatedAt: session.updatedAt
                }
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

            const sessions = await ChatSession.find({ userId })
                .select('_id title messageCount lastMessage updatedAt')
                .sort({ updatedAt: -1 })
                .limit(20);

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

            const session = await ChatSession.findOne({ _id: sessionId, userId });

            if (!session) {
                return res.status(404).json({ success: false, error: 'Session not found' });
            }

            res.json({
                success: true,
                session: {
                    _id: session._id,
                    title: session.title || 'New Chat',
                    messages: session.messages,
                    messageCount: session.messageCount,
                    createdAt: session.createdAt,
                    updatedAt: session.updatedAt
                }
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

            const result = await ChatSession.deleteOne({ _id: sessionId, userId });

            if (result.deletedCount === 0) {
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
            const session = await ChatSession.findOne({ _id: sessionId, userId });

            if (!session) {
                console.warn(`⚠️ Session ${sessionId} not found for user ${userId}`);
                return;
            }

            // Add user and bot messages
            session.messages.push({
                id: Date.now(),
                text: userMessage || (files.length > 0 ? `📁 Shared ${files.length} file(s)` : ''),
                sender: 'user',
                timestamp: new Date(),
                files: files
            });
            session.messages.push({
                id: Date.now() + 1,
                text: botResponse,
                sender: 'bot',
                timestamp: new Date(),
                source
            });

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

            await session.save();
        } catch (error) {
            console.error('⚠️ Failed to save message:', error);
        }
    }

    // Get fallback response for offline mode
    getFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('stream') || lowerMessage.includes('science') || lowerMessage.includes('commerce') || lowerMessage.includes('arts')) {
            return `🎓 **Stream Selection Guide**\n\n**Science Stream:**\n✅ **Best for:** Engineering, Medicine, Research\n📚 **Subjects:** Physics, Chemistry, Math/Biology\n🎯 **Top Careers:**\n• Software Engineer (₹8-20 LPA)\n• Doctor (₹6-15 LPA)\n• Data Scientist (₹10-25 LPA)\n• Research Scientist (₹7-18 LPA)\n\n**Commerce Stream:**\n✅ **Best for:** Business, Finance, Management\n📚 **Subjects:** Accounts, Economics, Business\n🎯 **Top Careers:**\n• Chartered Accountant (₹8-20 LPA)\n• MBA Graduate (₹10-30 LPA)\n• Financial Analyst (₹6-15 LPA)\n\n**Arts Stream:**\n✅ **Best for:** Law, Journalism, Civil Services\n📚 **Subjects:** History, Political Science, Psychology\n🎯 **Top Careers:**\n• Lawyer (₹5-15 LPA)\n• Civil Servant (₹8-25 LPA)\n• Journalist (₹4-12 LPA)\n\n💡 **Choosing Tip:** Consider your interests, aptitude, and career goals.`;
        }
        
        if (lowerMessage.includes('tcs') || lowerMessage.includes('tata consultancy')) {
            return `🏢 **TCS Recruitment Process**\n\n📋 **Process:**\n1. Online Test (Aptitude + Coding)\n2. Technical Interview\n3. HR Interview\n\n💰 **Salary:**\n• Freshers: ₹3.5-7 LPA\n\n🎓 **Eligibility:**\n• 60% in academics\n• No backlogs\n• Good communication`;
        }
        
        if (lowerMessage.includes('jee') || lowerMessage.includes('engineering')) {
            return `📚 **JEE Preparation**\n\n📖 **Syllabus:**\n• Physics, Chemistry, Mathematics\n\n📅 **Study Plan:**\n• 6-8 hours daily\n• Regular mock tests\n• Focus weak areas`;
        }
        
        return `🤖 **Career Guidance Assistant**\n\nI can help with:\n• Stream selection\n• Job guidance\n• Entrance exams\n• Skills development\n\n**Try asking:**\n• "Which stream is best for me?"\n• "TCS hiring process"\n• "JEE preparation tips"\n• "Skills for data science"`;
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
            const chats = await ChatSession.find({ userId })
                .select('_id title messageCount updatedAt')
                .sort({ updatedAt: -1 });
            
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
            
            await ChatSession.deleteOne({ _id: id, userId });
            
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
            
            const session = new ChatSession({
                userId,
                title: sessionName,
                messages
            });
            await session.save();
            
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
