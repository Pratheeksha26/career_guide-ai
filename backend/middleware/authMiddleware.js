const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from header
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No authentication token, access denied' 
    });
  }

  try {
    // Verify token
    const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET;
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired, please login again' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token, please login again' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error during authentication' 
    });
  }
};

// Optional: Admin middleware
const adminMiddleware = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Access denied, admin privileges required' 
    });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };