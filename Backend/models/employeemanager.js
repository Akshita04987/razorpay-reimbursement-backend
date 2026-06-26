'use strict';

module.exports = (sequelize, DataTypes) => {
  const EmployeeManager = sequelize.define('EmployeeManager', {
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
    manager_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    tableName: 'employee_managers',
    timestamps: true,
    updatedAt: false
  });

  EmployeeManager.associate = (models) => {
    // Belongs to employee
    EmployeeManager.belongsTo(models.User, {
      foreignKey: 'employee_id',
      as: 'employee'
    });

    // Belongs to manager
    EmployeeManager.belongsTo(models.User, {
      foreignKey: 'manager_id',
      as: 'manager'
    });
  };

  return EmployeeManager;
};
