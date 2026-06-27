require('dotenv').config({ quiet: true });
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require('../models');
const env = require('./config/env');
const logger = require('./utils/logger');
const { sendSuccess } = require('./utils/response');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const reimbursementRoutes = require('./routes/reimbursementRoutes');

const app = express();
const frontendPath = path.join(__dirname, '..', '..', 'Frontend');

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://razorpay-reimbursement-frontend.onrender.com'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/app', express.static(frontendPath));

db.sequelize.authenticate()
  .then(() => {
    logger.info('Database connected');
  })
  .catch((error) => {
    logger.error('Database unavailable, server still running', {
      error: error.message
    });
  });

app.get('/', (req, res) => {
  return sendSuccess(res, 200, 'Razorpay Reimbursement Management API');
});

app.get('/health', (req, res) => {
  return sendSuccess(res, 200, 'Server is healthy', {
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use('/rest', authRoutes);
app.use('/rest', roleRoutes);
app.use('/rest', employeeRoutes);
app.use('/rest', reimbursementRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(env.port, () => {
  logger.info('Server started', { port: env.port });
});

app.server = server;
module.exports = app;
