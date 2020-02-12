'use strict';
/* Migrations: son cambios y cosas que queremos ejecutar en la base de datos. Una vez hecha una migracion, se debe crear una nueva ante algun cambio que queramos hacer.
Ejemplo: npx sequelize migration:create --name create_nombre-entidad_table */
//UP: LOGICA PARA DAR DE ALTA BASE DE DATOS // DOWN: LOGICA PARA DAR DE BAJA BASE DE DATO
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Interests', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      percentage: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false
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
    return queryInterface.dropTable('Interests');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
