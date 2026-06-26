const userService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await userService.getEmployees();
  return sendSuccess(res, 200, 'Employees fetched successfully', { employees });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  return sendSuccess(res, 200, 'Users fetched successfully', { users });
});

const assignManager = asyncHandler(async (req, res) => {
  const relationship = await userService.assignManager(req.body);
  return sendSuccess(res, 201, 'Manager assigned successfully', { relationship });
});

const removeManager = asyncHandler(async (req, res) => {
  await userService.removeManager(req.body);
  return sendSuccess(res, 200, 'Manager removed successfully');
});

module.exports = {
  assignManager,
  getAllEmployees,
  getAllUsers,
  removeManager
};
