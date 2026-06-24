const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');

// Public routes - no authentication required
router.post('/onboardings/register', register);
router.post('/onboardings/login', login);
router.post('/onboardings/logout', logout);

module.exports = router;
