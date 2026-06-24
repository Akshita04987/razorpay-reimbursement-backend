const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    // If no token, user is not logged in
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object
    req.user = decoded;

    // Continue to next middleware/route
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
