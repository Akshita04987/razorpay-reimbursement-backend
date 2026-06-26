const reimbursementService = require('../services/reimbursementService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const createReimbursement = asyncHandler(async (req, res) => {
  const reimbursement = await reimbursementService.createReimbursement({
    ...req.body,
    employeeId: req.user.id
  });

  return sendSuccess(res, 201, 'Reimbursement created successfully', {
    reimbursement
  });
});

const updateReimbursement = asyncHandler(async (req, res) => {
  const reimbursement = await reimbursementService.updateReimbursementStatus({
    reimbursementId: req.params.id,
    action: req.body.action,
    approver: req.user
  });

  return sendSuccess(res, 200, 'Reimbursement updated successfully', {
    reimbursement
  });
});

const getAllReimbursements = asyncHandler(async (req, res) => {
  const reimbursements = await reimbursementService.getVisibleReimbursements(req.user);
  return sendSuccess(res, 200, 'Reimbursements fetched successfully', {
    reimbursements
  });
});

const getMyReimbursements = asyncHandler(async (req, res) => {
  const reimbursements = await reimbursementService.getUserReimbursements({
    requestedUserId: req.user.id,
    currentUser: req.user
  });

  return sendSuccess(res, 200, 'Reimbursements fetched successfully', {
    reimbursements
  });
});

const getUserReimbursements = asyncHandler(async (req, res) => {
  const reimbursements = await reimbursementService.getUserReimbursements({
    requestedUserId: req.params.userId,
    currentUser: req.user
  });

  return sendSuccess(res, 200, 'User reimbursements fetched successfully', {
    reimbursements
  });
});

module.exports = {
  createReimbursement,
  getAllReimbursements,
  getMyReimbursements,
  getUserReimbursements,
  updateReimbursement
};
