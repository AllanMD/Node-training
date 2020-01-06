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
    res.send('Hola lcdtm');
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
        if (user.name === '' || user.lastName === '') {
            response = {
                error: true,
                code: 501,
                message: "El usuario no ha sido creado"
            };
        } else {
            response = {
                error: false,
                code: 200,
                message: "Respuesta del usuario",
                response: user
            };
        }
        res.send(response);
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
        res.send(response);
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
        res.send(response);
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
        res.send(response);
    });

/**
 * Para usar datos por parametro. Ejemplo: user/1
 */
app.get('/user/:id', function (req, res, next) {
    console.log('ID:', req.params.id);
    res.send(req.params.id);
});

/**
 * Para usar datos por query. Ejemplo: /user?id=2
 */
app.get('/users', function(req, res){
    res.send(req.query.id); //TODO
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
 * Manejo de errores
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
