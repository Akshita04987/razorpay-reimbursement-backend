const { Reimbursement, ApprovalLog, User } = require('../../models');
const AppError = require('../utils/appError');

const employeeInclude = {
  model: User,
  as: 'employee',
  attributes: { exclude: ['password'] }
};

const createReimbursement = async ({ title, description, amount, employeeId }) => {
  if (!title || !amount) {
    throw new AppError('Title and amount are required', 400);
  }

  return Reimbursement.create({
    employee_id: employeeId,
    title,
    description,
    amount,
    status: 'PENDING'
  });
};

const updateReimbursementStatus = async ({ reimbursementId, action, approver }) => {
  if (!['APPROVED', 'REJECTED'].includes(action)) {
    throw new AppError('Action must be APPROVED or REJECTED', 400);
  }

  const reimbursement = await Reimbursement.findByPk(reimbursementId);
  if (!reimbursement) {
    throw new AppError('Reimbursement not found', 404);
  }

  if (reimbursement.status !== 'PENDING') {
    throw new AppError('Only pending reimbursements can be updated', 400);
  }

  if (approver.role === 'RM') {
    if (reimbursement.rm_approved) {
      throw new AppError('Already approved by RM', 400);
    }
    await reimbursement.update({ rm_approved: action === 'APPROVED' });
  } else if (approver.role === 'APE') {
    if (!reimbursement.rm_approved) {
      throw new AppError('Must be approved by RM first', 400);
    }
    if (reimbursement.ape_approved) {
      throw new AppError('Already approved by APE', 400);
    }
    await reimbursement.update({ ape_approved: action === 'APPROVED' });
  } else {
    throw new AppError('Insufficient permissions', 403);
  }

  if (action === 'REJECTED') {
    await reimbursement.update({ status: 'REJECTED' });
  } else if (reimbursement.rm_approved && reimbursement.ape_approved) {
    await reimbursement.update({ status: 'APPROVED' });
  }

  await ApprovalLog.create({
    reimbursement_id: reimbursementId,
    approved_by: approver.id,
    role: approver.role,
    action
  });

  return reimbursement;
};

const getVisibleReimbursements = async (user) => {
  const query = {
    include: [employeeInclude],
    order: [['createdAt', 'DESC']]
  };

  if (user.role === 'EMP') {
    query.where = { employee_id: user.id };
  } else if (user.role === 'RM') {
    query.where = { rm_approved: false, status: 'PENDING' };
  } else if (user.role === 'APE') {
    query.where = { rm_approved: true, ape_approved: false, status: 'PENDING' };
  }

  return Reimbursement.findAll(query);
};

const getUserReimbursements = async ({ requestedUserId, currentUser }) => {
  const canViewAnyUser = ['RM', 'APE', 'CFO'].includes(currentUser.role);
  if (requestedUserId !== currentUser.id && !canViewAnyUser) {
    throw new AppError('Insufficient permissions', 403);
  }

  return Reimbursement.findAll({
    where: { employee_id: requestedUserId },
    include: [employeeInclude],
    order: [['createdAt', 'DESC']]
  });
};

module.exports = {
  createReimbursement,
  getUserReimbursements,
  getVisibleReimbursements,
  updateReimbursementStatus
};
