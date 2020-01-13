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

let response = {
    error: false,
    code: 200,
    message: ''
};

router.route('/')
    .get(async(req, res) =>{
        const connection = await dbConnection();
        try {
            const [results, fields] = await connection.query('SELECT * FROM users');
            res.status(200).send(results);
        } catch (error) {
            console.log(error);

            res.status(500).send("Error obteniendo los usuarios de la bd");
        }
        connection.end();
    })
    /*
    con mysql2, al hacer connection.query(), si no recibe un callback como parametro, devuelve una promise
    y mediante async y await manejamos esas promesas.
    callback y async/await son 2 maneras de manejar asincronismo.
    */
    .post(async function (req, res) {
        if (!req.body.user || !req.body.pass) {
            response = {
                error: true,
                code: 400,
                message: "El campo user y pass son requeridos"
            };
            res.status(response.code).send(response);
        }
        else {
            const connection = await dbConnection();

            try {
                const results = await connection.query('INSERT INTO users(user, pass) VALUES(?,?)', [req.body.user, req.body.pass]);
                var user = new User(req.body.user, req.body.pass);
                console.log(results);
                response = {
                    error: false,
                    code: 200,
                    message: "Usuario creado!",
                    response: user
                };
            } catch (error) {
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
                console.log("Error code: " + error);
            }

            res.status(response.code).send(response);

            connection.end();
        }
    })

module.exports = router;