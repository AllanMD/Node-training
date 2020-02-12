require('dotenv').config(); // to search de env variables in .env
//TODO: pasar esto con variables de entorno.
module.exports = {
  "development": {
    "username": "root",
    "password": "",
    "database": "sequelize_demo",
    "host": "localhost",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  }
}
