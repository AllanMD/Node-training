'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Loans', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      payments: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      interest_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Interests',
          key: 'id'
        }
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Loans');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
