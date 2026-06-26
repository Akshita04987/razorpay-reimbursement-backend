const userService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const assignRole = asyncHandler(async (req, res) => {
  const user = await userService.assignRole(req.body);
  return sendSuccess(res, 200, 'Role assigned successfully', { user });
});

module.exports = {
  assignRole
};
