const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getAllUsers,
  assignManager,
  removeManager
} = require('../controllers/employeeController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/employees', authenticate, getAllEmployees);
router.get('/users', authenticate, authorize('CFO'), getAllUsers);
router.post('/employees/assign', authenticate, authorize('CFO'), assignManager);
router.delete('/employees/assign', authenticate, authorize('CFO'), removeManager);

module.exports = router;
