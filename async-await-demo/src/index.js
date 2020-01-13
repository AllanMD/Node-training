const express = require('express');
const app = express();
const path = require('path'); 
const bodyParser = require('body-parser'); // para manejo de datos por post 

var users = require('./app/routes/users');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/users', users);

app.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
});
