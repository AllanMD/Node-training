'use strict';
/*
SEEDERS: son datos por defecto que se pueden insertar en las tablas: se define en UP que datos insertar, 
y en DOWN como revertir esos datos insertados. npx sequelize-cli db:seed:all --> para ejecutar todos los seeders. 
npx sequelize-cli db:seed:undo:all ---> para revertir */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Interests', [{
      percentage: 12.4,
      type: "hola",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Interests', null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
