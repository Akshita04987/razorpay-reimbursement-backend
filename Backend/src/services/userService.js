const { User, EmployeeManager } = require('../../models');
const AppError = require('../utils/appError');
const { sanitizeUser } = require('./authService');

const validRoles = ['EMP', 'RM', 'APE', 'CFO'];

const getAllUsers = async () => {
  return User.findAll({
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']]
  });
};

const getEmployees = async () => {
  return User.findAll({
    where: { role: 'EMP' },
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']]
  });
};

const assignRole = async ({ userId, role }) => {
  if (!validRoles.includes(role)) {
    throw new AppError('Invalid role', 400);
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  await user.update({ role });
  return sanitizeUser(user);
};

const assignManager = async ({ employeeId, managerId }) => {
  const employee = await User.findByPk(employeeId);
  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  const manager = await User.findByPk(managerId);
  if (!manager) {
    throw new AppError('Manager not found', 404);
  }

  if (manager.role !== 'RM') {
    throw new AppError('Manager must have RM role', 400);
  }

  return EmployeeManager.create({
    employee_id: employeeId,
    manager_id: managerId
  });
};

const removeManager = async ({ employeeId, managerId }) => {
  const deletedCount = await EmployeeManager.destroy({
    where: {
      employee_id: employeeId,
      manager_id: managerId
    }
  });

  if (deletedCount === 0) {
    throw new AppError('Relationship not found', 404);
  }
};

module.exports = {
  assignManager,
  assignRole,
  getAllUsers,
  getEmployees,
  removeManager
};
