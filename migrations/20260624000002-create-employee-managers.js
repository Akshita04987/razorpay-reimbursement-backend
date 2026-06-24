'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employee_managers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      employee_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      manager_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add unique constraint for employee_id and manager_id pairing
    await queryInterface.addConstraint('employee_managers', {
      fields: ['employee_id', 'manager_id'],
      type: 'unique',
      name: 'employee_managers_unique_combination'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('employee_managers');
  }
};
