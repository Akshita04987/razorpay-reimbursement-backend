require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('../models');

const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const reimbursementRoutes = require('./routes/reimbursementRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection
db.sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Razorpay Reimbursement Management API' });
});

// Mount all routes with /rest prefix
app.use('/rest', authRoutes);
app.use('/rest', roleRoutes);
app.use('/rest', employeeRoutes);
app.use('/rest', reimbursementRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 7002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
