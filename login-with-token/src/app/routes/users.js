var express = require('express');
var router = express.Router();
const dbConnection = require("../../config/dbConnection"); // para conexion a bd // por cada "../" sube un nivel en las carpetas
const redis = require("../../config/redis"); // para conexion a redis

class User {
    constructor(user, pass) {
        this.id = 0;
        this.user = user;
        this.pass = pass;
    }
}

let response = {
    error: false,
    code: 200,
    message: ''
};

//router.use(middleware); // router.use va a usar el middleware pasado por parametro en cada llamada a este route

/**
 * Funcion que autentica mediante un token una llamada a una api
 * https://carlosazaustre.es/autenticacion-con-token-en-node-js/
 */
function auth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: "La peticion no tiene header de autorizacion" });
    }
    redis.exists(req.headers.authorization, function (err, reply) {
        if (err) {
            console.log("error: " + err);
            return res.status(500).send({ message: "Error con la base de datos!" });
        }
        if (reply === 0) { // 0 = no existe, 1 = si existe
            console.log("TOKEN INCORRECTO");
            return res.status(403).send({ message: "El token expiró o es incorrecto!" });
        }
        next();
        // en caso de que todo este bien, con el next() se pasa el control a la siguiente funcion middleware

        //esto puede ir en un archivo separado y ser exportado, como aparece en la pagina
    });
};


/**
 * Para agrupar todos los metodos que esten bajo una misma ruta
 */
router.route('/')
    // el primer middleware ejecuta la autenticacion, si sale bien, continua con el siguiente middleware
    .get(auth, function (req, res) {
        const connection = dbConnection();
        connection.query('SELECT * FROM users', function (error, results, fields) {
            if (error) {
                res.status(500).send("Error obteniendo los usuarios de la bd");
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
                code: 400,
                message: "El campo user y pass son requeridos"
            };
            res.status(response.code).send(response);
        }
        else {
            const connection = dbConnection();
            connection.query('INSERT INTO users(user, pass) VALUES(?,?)', [req.body.user, req.body.pass], function (error, result) {
                if (error) {
                    if (error.code == "ER_DUP_ENTRY") {
                        response = {
                            error: true,
                            code: 409,
                            message: "Usuario ya existe"
                        };
                    } else {
                        response = {
                            error: true,
                            code: 500,
                            message: error
                        };
                    }
                    console.log("Error code: " + error.code);
                } else {
                    var user = new User(req.body.user, req.body.pass);
                    console.log(result);
                    response = {
                        error: false,
                        code: 200,
                        message: "Usuario creado!",
                        response: user
                    };
                }
                res.status(response.code).send(response);
            });
            connection.end();
        }
    })

    /*
    .put(auth, function (req, res) {
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
    })*/
    ;

router.delete("delete/:id", auth, function (req, res) {
    const connection = dbConnection();
    connection.query('DELETE FROM users WHERE user_id = ?', [req.params.id], function (error, result) {
        if (error) {
            response = {
                error: true,
                code: 500,
                message: error
            }
            console.log("Code:" + error.code);
        } else {
            if (result.affectedRows == 0) {
                response = {
                    error: true,
                    code: 409,
                    message: "No existe un usuario con ese id"
                }
            } else {
                response = {
                    error: false,
                    code: 200,
                    message: 'Usuario eliminado'
                }
            }
            console.log(result);
        }
        res.status(response.code).send(response);
    });
    connection.end();
});

router.post("/login", function (req, res) {
    const connection = dbConnection();
    connection.query('SELECT * FROM users WHERE user = ?', [req.body.user], function (error, results, fields) {
        if (error) {
            response = {
                error: true,
                code: 500,
                message: error
            };
            console.log(error.code);
        } else {
            if (results.length == 0) {
                response = {
                    error: true,
                    code: 401,
                    message: "Usuario no existe"
                };
            } else if (results[0].pass != req.body.pass) {
                response = {
                    error: true,
                    code: 401,
                    message: "Contraseña incorrecta"
                }
            } else {
                let token = generateToken();
                response = {
                    error: false,
                    code: 200,
                    message: "Login exitoso!",
                    token: token
                };
                redis.set(token, req.body.user);
            }
        }
        res.status(response.code).send(response);
    });
    connection.end();
});

/**
 * Metodo para desloguearse. Elimina el token del redis.
 */
router.delete("/logout", auth, function (req, res) {
    redis.delete(req.headers.authorization, function (error, reply) {
        if (error) {
            response = {
                error: true,
                code: 500,
                message: error
            }
            console.log(error);
        }
        else {
            response = {
                error: false,
                code: 200,
                message: "Logout exitoso!"
            }
        }
        res.status(response.code).send(response);
    });
})

/**
 * Genera un token. El token es un string aleatorio.
 */
function generateToken() { //https://unipython.com/generar-token-random-con-java-script/
    var token = Math.random().toString(36).substring(2);
    console.log("Token: " + token);
    return token;
}

module.exports = router;

