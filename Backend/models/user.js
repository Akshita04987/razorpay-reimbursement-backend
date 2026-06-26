'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('EMP', 'RM', 'APE', 'CFO'),
      allowNull: false
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  User.associate = (models) => {
    // User as employee - has many managers
    User.hasMany(models.EmployeeManager, {
      foreignKey: 'employee_id',
      as: 'managers'
    });

    // User as manager - has many employees
    User.hasMany(models.EmployeeManager, {
      foreignKey: 'manager_id',
      as: 'employees'
    });

    // User creates reimbursements
    User.hasMany(models.Reimbursement, {
      foreignKey: 'employee_id',
      as: 'reimbursements'
    });

    // User approves reimbursements
    User.hasMany(models.ApprovalLog, {
      foreignKey: 'approved_by',
      as: 'approvals'
    });
  };

  return User;
};
