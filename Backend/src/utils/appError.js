class AppError extends Error {
  constructor(message, statusCode = 500, error = {}) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    this.isOperational = true;
  }
}

module.exports = AppError;
