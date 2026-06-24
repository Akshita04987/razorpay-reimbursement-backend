'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('approval_logs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      reimbursement_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'reimbursements',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      approved_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false
      },
      action: {
        type: Sequelize.ENUM('APPROVED', 'REJECTED'),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('approval_logs');
    // Drop the custom ENUM type in Postgres to avoid issues on re-migration
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_approval_logs_action";');
  }
};
