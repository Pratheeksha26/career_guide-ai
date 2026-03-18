const express = require('express');
const router = express.Router();
const path = require('path');
const chatController = require('../controllers/chatController');
const { authMiddleware } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'chat_files');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Apply auth middleware to all chat routes
router.use(authMiddleware);

// Session management routes
router.post('/sessions', chatController.createSession);
router.get('/sessions', chatController.getSessions);
router.get('/sessions/:id', chatController.getSession);
router.delete('/sessions/:id', chatController.deleteSession);

// Message routes
router.post('/message', upload.array('files', 5), chatController.sendMessage);

// Legacy routes for backward compatibility
router.get('/history', chatController.getChatHistory);
router.delete('/history/:id', chatController.deleteChat);
router.post('/save', chatController.saveChatSession);

// Test endpoint (optional - can be public)
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Chat API is working!',
    userId: req.userId
  });
});

module.exports = router;
