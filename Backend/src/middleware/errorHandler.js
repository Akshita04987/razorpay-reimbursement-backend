const logger = require('../utils/logger');
const { sendError } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Something went wrong';
  const error = err.error || {};

  logger.error(message, {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });

  return sendError(res, statusCode, message, error);
};

const notFoundHandler = (req, res) => {
  return sendError(res, 404, 'Route not found', {
    path: req.originalUrl
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
