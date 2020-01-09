var mysql = require('mysql');

module.exports = () => {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'node_login',
        port: 3306
    });

    connection.connect(function (error) {
        if (error) {
            throw error;
        } else {
            console.log('Conexion a bd exitosa!');
        }
    }); 
    
    return connection;
}