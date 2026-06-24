const express = require('express');
const router = express.Router();
const {
  createReimbursement,
  updateReimbursement,
  getAllReimbursements,
  getUserReimbursements
} = require('../controllers/reimbursementController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected routes - authentication required
router.post('/reimbursements', authenticate, createReimbursement);
router.patch('/reimbursements/:id', authenticate, authorize('RM', 'APE'), updateReimbursement);
router.get('/reimbursements', authenticate, getAllReimbursements);
router.get('/reimbursements/:userId', authenticate, getUserReimbursements);

module.exports = router;
