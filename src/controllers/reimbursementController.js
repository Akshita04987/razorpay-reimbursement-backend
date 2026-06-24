const { Reimbursement, ApprovalLog, User } = require('../../models');

const createReimbursement = async (req, res) => {
  try {
    const { title, description, amount } = req.body;
    const employeeId = req.user.id;

    const reimbursement = await Reimbursement.create({
      employee_id: employeeId,
      title,
      description,
      amount,
      status: 'PENDING'
    });

    res.status(201).json({ message: 'Reimbursement created successfully', reimbursement });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reimbursement' });
  }
};

const updateReimbursement = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'APPROVED' or 'REJECTED'
    const userRole = req.user.role;
    const userId = req.user.id;

    // Find reimbursement
    const reimbursement = await Reimbursement.findByPk(id);
    if (!reimbursement) {
      return res.status(404).json({ error: 'Reimbursement not found' });
    }

    // Check permissions based on role
    if (userRole === 'RM') {
      // RM can approve first
      if (reimbursement.rm_approved) {
        return res.status(400).json({ error: 'Already approved by RM' });
      }
      await reimbursement.update({ rm_approved: action === 'APPROVED' });
    } else if (userRole === 'APE') {
      // APE can approve second
      if (!reimbursement.rm_approved) {
        return res.status(400).json({ error: 'Must be approved by RM first' });
      }
      if (reimbursement.ape_approved) {
        return res.status(400).json({ error: 'Already approved by APE' });
      }
      await reimbursement.update({ ape_approved: action === 'APPROVED' });
    } else {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Update status based on approvals
    if (reimbursement.rm_approved && reimbursement.ape_approved) {
      await reimbursement.update({ status: 'APPROVED' });
    } else if (action === 'REJECTED') {
      await reimbursement.update({ status: 'REJECTED' });
    }

    // Create approval log
    await ApprovalLog.create({
      reimbursement_id: id,
      approved_by: userId,
      role: userRole,
      action
    });

    res.json({ message: 'Reimbursement updated successfully', reimbursement });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reimbursement' });
  }
};

const getAllReimbursements = async (req, res) => {
  try {
    const reimbursements = await Reimbursement.findAll({
      include: [
        {
          model: User,
          as: 'employee',
          attributes: { exclude: ['password'] }
        }
      ]
    });
    res.json(reimbursements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reimbursements' });
  }
};

const getUserReimbursements = async (req, res) => {
  try {
    const { userId } = req.params;
    const reimbursements = await Reimbursement.findAll({
      where: { employee_id: userId },
      include: [
        {
          model: User,
          as: 'employee',
          attributes: { exclude: ['password'] }
        }
      ]
    });
    res.json(reimbursements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user reimbursements' });
  }
};

module.exports = {
  createReimbursement,
  updateReimbursement,
  getAllReimbursements,
  getUserReimbursements
};
