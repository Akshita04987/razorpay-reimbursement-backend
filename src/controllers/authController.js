const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'EMP' // Default role is EMP
    });

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({ message: 'User registered successfully', user: userResponse });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({ message: 'Login successful', user: userResponse });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

const logout = (req, res) => {
  // Clear cookie
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
};

module.exports = { register, login, logout };
