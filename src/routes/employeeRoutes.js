const express = require('express');
const router = express.Router();
const { getAllEmployees, assignManager, removeManager } = require('../controllers/employeeController');
const { authenticate } = require('../middleware/auth');

// Protected routes - authentication required
router.get('/employees', authenticate, getAllEmployees);
router.post('/employees/assign', authenticate, assignManager);
router.delete('/employees/assign', authenticate, removeManager);

module.exports = router;
