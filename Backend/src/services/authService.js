const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const env = require('../config/env');
const AppError = require('../utils/appError');

const validRoles = ['EMP', 'RM', 'APE', 'CFO'];

const sanitizeUser = (user) => {
  const plainUser = user.toJSON();
  delete plainUser.password;
  return plainUser;
};

const registerUser = async ({ name, email, password, role = 'EMP' }) => {
  if (!name || !email || !password) {
    throw new AppError('Name, email and password are required', 400);
  }

  if (!validRoles.includes(role)) {
    throw new AppError('Invalid role', 400);
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  return sanitizeUser(user);
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    env.jwtSecret,
    { expiresIn: '24h' }
  );

  return {
    token,
    user: sanitizeUser(user)
  };
};

module.exports = {
  loginUser,
  registerUser,
  sanitizeUser
};
