const { User, EmployeeManager } = require('../../models');

const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.findAll({
      where: { role: 'EMP' },
      attributes: { exclude: ['password'] }
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

const assignManager = async (req, res) => {
  try {
    const { employeeId, managerId } = req.body;

    // Check if employee exists
    const employee = await User.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Check if manager exists
    const manager = await User.findByPk(managerId);
    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    // Create employee-manager relationship
    const relationship = await EmployeeManager.create({
      employee_id: employeeId,
      manager_id: managerId
    });

    res.status(201).json({ message: 'Manager assigned successfully', relationship });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign manager' });
  }
};

const removeManager = async (req, res) => {
  try {
    const { employeeId, managerId } = req.body;

    // Delete employee-manager relationship
    const deleted = await EmployeeManager.destroy({
      where: {
        employee_id: employeeId,
        manager_id: managerId
      }
    });

    if (deleted === 0) {
      return res.status(404).json({ error: 'Relationship not found' });
    }

    res.json({ message: 'Manager removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove manager' });
  }
};

module.exports = { getAllEmployees, assignManager, removeManager };
