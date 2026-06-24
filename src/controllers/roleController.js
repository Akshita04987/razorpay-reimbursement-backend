const { User } = require('../../models');

const assignRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    // Validate role
    const validRoles = ['EMP', 'RM', 'APE', 'CFO'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update role
    await user.update({ role });

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({ message: 'Role assigned successfully', user: userResponse });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign role' });
  }
};

module.exports = { assignRole };
