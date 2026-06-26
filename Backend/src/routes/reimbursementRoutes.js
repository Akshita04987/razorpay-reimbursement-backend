const express = require('express');
const router = express.Router();
const {
  createReimbursement,
  updateReimbursement,
  getAllReimbursements,
  getMyReimbursements,
  getUserReimbursements
} = require('../controllers/reimbursementController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/reimbursements', authenticate, createReimbursement);
router.patch('/reimbursements/:id', authenticate, authorize('RM', 'APE'), updateReimbursement);
router.get('/reimbursements', authenticate, getAllReimbursements);
router.get('/reimbursements/me', authenticate, getMyReimbursements);
router.get('/reimbursements/:userId', authenticate, getUserReimbursements);

module.exports = router;
