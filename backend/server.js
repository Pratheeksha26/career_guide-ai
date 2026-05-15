// Force IPv4 globally to fix ENETUNREACH on some cloud environments (e.g., Render)
const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to PostgreSQL
sequelize.authenticate()
  .then(() => {
    console.log('✅ PostgreSQL connected successfully');
    // Sync models
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Database models synced');
  })
  .catch(err => {
    console.error('❌ PostgreSQL connection error:', err.message);
    process.exit(1);
  });

// Middleware - Updated CORS to allow all origins for development
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads directory statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging middleware with better error tracking
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`\n[${timestamp}] ${req.method} ${req.originalUrl}`);
    console.log('Origin:', req.headers.origin);
    
    // Log body for POST requests (but hide passwords)
    if (req.method === 'POST' && req.body) {
        const logBody = { ...req.body };
        if (logBody.password) {
            logBody.password = '***HIDDEN***';
        }
        if (logBody.currentPassword) {
            logBody.currentPassword = '***HIDDEN***';
        }
        if (logBody.newPassword) {
            logBody.newPassword = '***HIDDEN***';
        }
        console.log('Body:', JSON.stringify(logBody).substring(0, 200));
    }
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        console.log('🔄 Handling preflight request');
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
        return res.status(200).end();
    }
    
    next();
});

// Import routes
const chatRoutes = require('./routes/chatRoutes');
const studyRoutes = require('./routes/studyRoutes');
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const interviewRoutes = require('./routes/interviewRoutes');

// No longer need pool middleware for MongoDB with Mongoose models

// Database connection is managed by mongoose globally

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);

// Test endpoints with better response
app.get('/test', (req, res) => {
    res.json({ 
        message: '✅ Backend is working!',
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                profile: 'GET /api/auth/me'
            },
            chat: 'POST /api/chat/message',
            health: 'GET /health',
            test: 'GET /test',
            study: 'GET /api/study/aptitude/questions',
            chatTest: 'GET /api/chat/test'
        },
        cors: 'Enabled for all origins',
        database: 'PostgreSQL connected'
    });
});

app.get('/health', async (req, res) => {
    let dbStatus = 'disconnected';
    try {
        await sequelize.authenticate();
        dbStatus = 'connected';
    } catch (err) {
        dbStatus = 'error';
    }
    
    res.status(200).json({ 
        status: 'OK', 
        message: 'Career Guidance API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        database: dbStatus,
        services: {
            auth: 'active',
            chat: 'active',
            study: 'active'
        }
    });
});

// Simple GET endpoint for chat (for testing in browser)
app.get('/api/chat/test', (req, res) => {
    res.json({
        message: 'Chat API is working!',
        instructions: 'Use POST /api/chat/message for actual chat (requires authentication)',
        note: 'This endpoint is public, but actual chat requires login'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🎯 Career Guidance Backend API',
        version: '1.2.0',
        status: 'Operational',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        features: [
            'User Authentication (JWT)',
            'AI Career Chatbot (Groq)',
            'Study Materials Database',
            'Aptitude Training Modules',
            'Career Resources',
            'Enhanced Security Middleware'
        ],
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                profile: 'GET /api/auth/me',
                logout: 'POST /api/auth/logout'
            },
            chat: {
                message: 'POST /api/chat/message (protected)',
                history: 'GET /api/chat/history (protected)'
            },
            study: {
                materials: 'GET /api/study/materials/:category',
                aptitude: {
                    questions: 'GET /api/study/aptitude/questions',
                    tests: 'GET /api/study/aptitude/tests'
                }
            }
        }
    });
});

// 404 handler
app.use('*', (req, res) => {
    console.log(`🔍 404: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ 
        success: false,
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method,
        availableEndpoints: {
            auth: 'POST /api/auth/register, POST /api/auth/login',
            test: 'GET /test',
            health: 'GET /health',
            root: 'GET /',
            chat: 'POST /api/chat/message',
            chatTest: 'GET /api/chat/test'
        }
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('💥 Server Error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ 
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════════╗
    ║      Career Guidance Backend v1.2.0           ║
    ╚════════════════════════════════════════════════╝
    
    🚀 Server started on port: ${PORT}
    🌐 Environment: ${process.env.NODE_ENV || 'development'}
    🗄️  Database: PostgreSQL (Neon)
    
    📍 Authentication Endpoints:
    • Register: POST http://localhost:${PORT}/api/auth/register
    • Login:    POST http://localhost:${PORT}/api/auth/login
    • Profile:  GET  http://localhost:${PORT}/api/auth/me
    
    📍 Other Endpoints:
    • Health:    http://localhost:${PORT}/health
    • Test:      http://localhost:${PORT}/test
    • Chat Test: http://localhost:${PORT}/api/chat/test
    
    🔧 Debug URLs:
    • Check CORS: curl -H "Origin: http://localhost:3000" -v http://localhost:${PORT}/health
    • Register: curl -X POST http://localhost:${PORT}/api/auth/register -H "Content-Type: application/json" -d '{"username":"test","email":"test@test.com","password":"password123"}'
    
    `);
    
    // Check environment
    console.log('📋 Environment Check:');
    console.log(`- PORT: ${PORT}`);
    console.log(`- DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ NOT SET'}`);
    console.log(`- JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ NOT SET (Required!)'}`);
    if (!process.env.JWT_SECRET) {
        // Fallback check for Replit secrets injection
        console.log('- Checking for SESSION_SECRET as fallback...');
    }
    console.log(`- GROQ_API_KEY: ${process.env.GROQ_API_KEY ? '✅ Set' : '❌ NOT SET (Optional)'}`);
    console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log(`- CORS: ✅ Enabled for multiple origins`);
    
    // Warn about missing JWT_SECRET
    if (!process.env.JWT_SECRET) {
        console.log('\n⚠️  WARNING: JWT_SECRET is not set in .env file!');
        console.log('   Authentication will not work properly.');
        console.log('   Add JWT_SECRET=your_secret_key to your .env file\n');
    }
});
