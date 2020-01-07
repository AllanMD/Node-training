const express = require('express');
const app = express();
var birds = require('./birds');

const bodyParser = require('body-parser'); // para manejo de datos por post 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/birds', birds);

let user = {
    name: "",
    lastName: ""
};

class User {
    constructor(name, lastName) { // TODO: agregar id
        this.name = name;
        this.lastName = lastName;
    }
}

let response = {
    error: false,
    code: 200,
    message: ''
};

/**
 * Para entender el next, probar y comentar la linea next(); para entender
 */
var myLogger = function (req, res, next) {
    console.log('LOGGED');
    next();
};
// TODO: preguntar
app.use(myLogger);


/**
 * Api para metodos get
 */
app.get('/', function (req, res) {
    response = {
        error: false,
        code: 200,
        message: "Punto de inicio"
    };
    res.send(response);
});


/**
 * Api para metodos post
 */
app.post("/hola", function (req, res) {
    res.status(200).send('Hola buen dia');
});

/**
 * Para agrupar todos los metodos que esten bajo una misma ruta
 */
app.route('/user')

    .get(function (req, res) {
        response = {
            error: false,
            code: 200,
            message: ""
        };
        getAll(function(error, result){
            if(error){
                res.status(500).send("Error obteniendo los usuarios");
                throw error;
            }
            res.status(200).send(result);
        });
    })

    .post(function (req, res) {
        if (!req.body.name || !req.body.lastName) {
            response = {
                error: true,
                code: 502,
                message: "El campo nombre y apellido son requeridos"
            };
        } else {
            if (user.name !== '' || user.lastName !== '') {
                response = {
                    error: true,
                    code: 503,
                    message: "El usuario ya fue creado previamente"
                };
            } else {
                user = {
                    name: req.body.name,
                    lastName: req.body.lastName
                };
                response = {
                    error: false,
                    code: 200,
                    message: "Usuario creado!",
                    response: user
                };
            }
        }
        save(user);
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
    });

/**
 * Para usar datos por parametro. Ejemplo: user/1
 */
app.get('/user/:id', function (req, res, next) {
    getById(req.params.id, function (error, result) {
        if(error) {
            throw error;
        }
        if(result.length > 0) {
            var user = new User(result[0].name, result[0].last_name);
            res.status(200).send(user);
        }else{
            res.status(404).send("No se encontro usuario con ese id");
        }
    });
    console.log('ID:', req.params.id);
});
// terminar: busqueda con querys
app.get('/users', function(req, res){
    if(req.query.id){
        console.log("ID:" + req.query.id);
        res.send("200");
    }
})

/**
 * Para usar datos por query. Ejemplo: /user?id=2
 */
app.get('/users', function (req, res) {
    res.send(req.query.name); //TODO
});

/**
 * Este metodo se ejecuta con cualquier tipo de peticion
 */
app.all('/secret', function (req, res, next) {
    console.log('Accessing the secret section ...');
    next(); // pass control to the next handler
});

/**
 * Para enviar 404 en caso de url no encontrada
 * Each app.use(middleware) is called every time a request is sent to the server. 
 * este debe ir al final de todo, sino siempre pasa por este primero
 */
app.use(function (req, res, next) {
    response = {
        error: true,
        code: 404,
        message: 'URL no encontrada'
    };
    res.status(404).send(response);
});

/**
 * Para manejo de errores (va al final) ?, ante los errores, lanza esto
 */
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
});

// -------------EJEMPLOS DE ACCESO A UNA RUTA---------------
/** Esta vía de acceso de ruta coincidirá con acd y abcd. */
//la "?" afecta al caracter que tiene antes, por eso, en este caso, la "b" puede o no ser necesaria en la ruta
app.get('/ab?cd', function (req, res) {
    res.send('ab?cd');
});

// el "+" indica que la cantidad de "b" no importa.
//Esta vía de acceso de ruta coincidirá con abcd, abbcd, abbbcd, etc.
app.get('/ab+cd', function (req, res) {
    res.send('ab+cd');
});

//el "*" indica que en medio de los dos puede ir cualquier cosa
// Esta vía de acceso de ruta coincidirá con abcd, abxcd, abRABDOMcd, ab123cd, etc.
app.get('/ab*cd', function (req, res) {
    res.send('ab*cd');
});

// En este caso, el "cd" puede o no ser necesario. Ejemplo: /abe y /abcde.
app.get('/ab(cd)?e', function (req, res) {
    res.send('ab(cd)?e');
});

// Para usar regular expressions. En este caso, cualquier ruta que contenga "a" accedera a este metodo
app.get(/a/, function (req, res) {
    res.send('/a/');
});


// ----------- MYSQL --------------
var mysql = require('mysql');
var connection = mysql.createConnection({
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
        console.log('Conexion correcta.');
    }
});

function save(user) {
    connection.query('INSERT INTO users(name, last_name) VALUES(?,?)', [user.name, user.lastName], function (error, result) {
        if (error) {
            throw error;
        } else {
            console.log(result);
        }
    }
    );
}

function getAll(callback) {
    connection.query('SELECT * FROM users', function (error, results, fields) {
        if (error){
            return callback(error);
        }else{
            return callback(null, results);
        }
    });
}

function getById(id, cb) { // hay que usar callbacks ya que las llamadas a base de datos son asincronas
    connection.query('SELECT * FROM users WHERE user_id = ?', [id], function (error, result) { // funcion callback
        if (error) {
            return cb(error);
        } else {
            return cb(null, result); // retornamos un callback
        }
    });
}
// TODO: explicar callback

getById(5, function (error, result) {
    console.log("Resultado: " + result[0].name);
})

//connection.end();    // TODO: averiguar esto