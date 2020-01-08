var express = require('express');
var router = express.Router();
const dbConnection = require("../../config/dbConnection"); // para conexion a bd // por cada "../" sube un nivel en las carpetas


class User {
    constructor(user, pass) {
        this.id = 0;
        this.user = user;
        this.pass = pass;
    }
}
/**
 * Para agrupar todos los metodos que esten bajo una misma ruta
 */
router.route('/')

    .get(function (req, res) {
        const connection = dbConnection();
        connection.query('SELECT * FROM users', function (error, results, fields) {
            if (error) {
                res.status(500).send("Error obteniendo los usuarios");
                throw error;
            } else {
                res.status(200).send(results);
            }
        });
        connection.end();
        //res.render("users/users"); // para probar vista
    })

    .post(function (req, res) {
        if (!req.body.user || !req.body.pass) {
            response = {
                error: true,
                code: 502,
                message: "El campo user y pass son requeridos"
            };
        }
        else {
            
            var user = new User(req.body.user, req.body.pass);
            response = {
                error: false,
                code: 200,
                message: "Usuario creado!",
                response: user
            }; //TODO: si el usuario ya existe, avisar
            save(user);
        }

        res.status(response.code).send(response);
    })

    .put(function (req, res) {
        if (!req.body.name || !req.body.lastName) {
            response = {
                error: true,
                code: 502,
                message: "El campo nombre y apellido son requeridos"
            };
        }
        else {
            if (user.name === '' || user.lastName === '') {
                response = {
                    error: true,
                    code: 501,
                    message: 'El usuario no ha sido creado'
                };
            } else {
                user = {
                    name: req.body.name,
                    lastName: req.body.lastName
                };
                response = {
                    error: false,
                    code: 200,
                    message: "Usuario actualizado",
                    response: user
                };
            }
        }
        res.status(response.code).send(response);
    })

    .delete(function (req, res) {
        if (user.name === '' || user.lastName === '') {
            response = {
                error: true,
                code: 501,
                message: 'El usuario no ha sido creado'
            };
        } else {
            response = {
                error: false,
                code: 200,
                message: 'Usuario eliminado'
            };
            user = {
                name: '',
                lastName: ''
            };
        }
        res.status(response.code).send(response);
    })
;

//TODO
router.get("/login", function(req, res){ /*
    // TODO: traer el usuario con el nombre, comprobar la contraseña que sea correcta,
    // avisar si esta mal la contraseña o si no existe el usuario
    const connection = dbConnection();
    connection.query('SELECT * FROM users WHERE ', function (error, results, fields) {
        if (error) {
            res.status(500).send("Error obteniendo los usuarios");
            throw error;
        } else {
            res.status(200).send(results);
        }
    });
    connection.end();*/
});

function save(user) {
    const connection = dbConnection();
    connection.query('INSERT INTO users(user, pass) VALUES(?,?)', [user.user, user.pass], function (error, result) {
        if (error) {
            console.log("Code:" + error.code);
            //throw error;
        } else {
            console.log(result);
        }
    });
    connection.end();
}
module.exports = router;
