const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const env = require('../config/env');

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 24 * 60 * 60 * 1000
};

const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  return sendSuccess(res, 201, 'User registered successfully', { user });
});

const login = asyncHandler(async (req, res) => {
  const { token, user } = await authService.loginUser(req.body);
  res.cookie('token', token, cookieOptions);

  return sendSuccess(res, 200, 'Login successful', {
    token,
    user
  });
});

const logout = (req, res) => {
  res.clearCookie('token');
  return sendSuccess(res, 200, 'Logout successful');
};

module.exports = {
  login,
  logout,
  register
};
