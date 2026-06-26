'use strict';

module.exports = (sequelize, DataTypes) => {
  const Reimbursement = sequelize.define('Reimbursement', {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      primaryKey: true,
      allowNull: false
    },
    employee_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    rm_approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ape_approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'reimbursements',
    timestamps: true
  });

  Reimbursement.associate = (models) => {
    // Belongs to employee
    Reimbursement.belongsTo(models.User, {
      foreignKey: 'employee_id',
      as: 'employee'
    });

    // Has many approval logs
    Reimbursement.hasMany(models.ApprovalLog, {
      foreignKey: 'reimbursement_id',
      as: 'approvalLogs'
    });
  };

  return Reimbursement;
};
