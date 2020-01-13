var mysql = require('mysql2/promise'); // para soportar promesas, hay que usar mysql

module.exports = async () => {
    connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'node_login',
        port: 3306
    });

    return connection;
}