'use strict';

module.exports = (sequelize, DataTypes) => {
  const ApprovalLog = sequelize.define('ApprovalLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      primaryKey: true,
      allowNull: false
    },
    reimbursement_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    approved_by: {
      type: DataTypes.UUID,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    },
    action: {
      type: DataTypes.ENUM('APPROVED', 'REJECTED'),
      allowNull: false
    }
  }, {
    tableName: 'approval_logs',
    timestamps: true,
    updatedAt: false
  });

  ApprovalLog.associate = (models) => {
    // Belongs to reimbursement
    ApprovalLog.belongsTo(models.Reimbursement, {
      foreignKey: 'reimbursement_id',
      as: 'reimbursement'
    });

    // Belongs to user who approved
    ApprovalLog.belongsTo(models.User, {
      foreignKey: 'approved_by',
      as: 'approver'
    });
  };

  return ApprovalLog;
};
