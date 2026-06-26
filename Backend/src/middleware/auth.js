const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../utils/appError');

const getToken = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return req.cookies.token;
};

const authenticate = (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return next(new AppError('Authentication required', 401));
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401));
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('Insufficient permissions', 403));
  }

  return next();
};

module.exports = {
  authenticate,
  authorize
};
