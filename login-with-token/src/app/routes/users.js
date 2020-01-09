var express = require('express');
var router = express.Router();
const dbConnection = require("../../config/dbConnection"); // para conexion a bd // por cada "../" sube un nivel en las carpetas
const redis = require("../../config/redis"); // para conexion a redis
redis(); //llama a la funcion del REDIS
var tokens = "";

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

/** 
 * Para entender el next, probar y comentar la linea next();
 */
var myLogger = function (req, res, next) {
    console.log('Logger');
    next(); // pasa el control al endpoint que fue llamado en primer lugar
};

router.use(myLogger); // router.use va a usar el middleware pasado por parametro en cada llamada a este route

/**
 * Funcion que autentica mediante un token una llamada a una api
 * https://carlosazaustre.es/autenticacion-con-token-en-node-js/
 */
function auth(req, res, next) {
    console.log("Headerss: " + req.headers.host);
    if (!req.headers.authorization) {
        return res.status(401).send({ message: "La peticion no tiene header de autorizacion" });
    }
    else if (req.headers.authorization !== tokens) { //TODO: cambiar a una funcion validateToken, q lo va a buscar en el bd redis
        return res.status(403).send({ message: "Token incorrecto!" });
    }
    next();
    // en caso de que todo este bien, con el next() se pasa el control a la siguiente funcion middleware

    //esto puede ir en un archivo separado y ser exportado, como aparece ne la pagina
};


/**
 * Para agrupar todos los metodos que esten bajo una misma ruta
 */
router.route('/')
    // el primer middleware ejecuta la autenticacion, si sale bien, continua con el siguiente
    .get(auth, function (req, res) {
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
                        throw error;
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

router.delete("/:id", auth, function (req, res) {
    const connection = dbConnection();
    connection.query('DELETE FROM users WHERE user_id = ?', [req.params.id], function (error, result) {
        if (error) {
            console.log("Code:" + error.code);
            throw error;
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
            console.log(error.code);
            throw error;
        } else {
            if (results.length == 0) {
                response = {
                    error: true,
                    code: 401,
                    message: "Usuario no existe"
                };
                res.status(response.code).send(response);
            } else if (results[0].pass != req.body.pass) {
                response = {
                    error: true,
                    code: 401,
                    message: "Contraseña incorrecta"
                }
                res.status(response.code).send(response)
            } else {
                tokens = generateToken();
                response = {
                    error: false,
                    code: 200,
                    message: "Login exitoso!",
                    token: tokens
                }
                res.status(response.code).send(response);
            }
        }
    });
    connection.end();
});

function generateToken() { //https://unipython.com/generar-token-random-con-java-script/
    var token = Math.random().toString(36).substring(2);
    console.log("Token: " + token);
    return token;
}

function validateToken(token){
    const redisClient = redis();
    redisClient.exists(token, function (err, reply) {
        if (err != null) {
            //error
            console.log("halo")
        }
        else {
            console.log("sfa");
        }
    });
}

module.exports = router;

//TODO: documentar codigo