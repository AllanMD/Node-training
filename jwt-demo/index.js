const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
var users = require('./src /app/routes/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())

app.use('/users', users);

app.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
});