var mysql = require('mysql');

module.exports = () => {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'node_mysql',
        port: 3306
    });

    connection.connect(function (error) {
        if (error) {
            throw error;
        } else {
            console.log('Conexion a bd correcta.');
        }
    }); 
    
    return connection;
}