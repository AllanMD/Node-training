const express = require('express');
const app = express();
const path = require('path'); 
const bodyParser = require('body-parser'); // para manejo de datos por post 

var filesRoute = require('./app/routes/files');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/files', filesRoute);

app.use(express.static(__dirname + '/public')); // con http://localhost:3000/images/google.jpg accedemos a la imagen, no es necesario especificar la carpeta "public", ya que lo detecta automaticamente
app.use('/static', express.static(__dirname + '/public')); // para acceder a los archivos bajo una ruta determinada, ej: http://localhost:3000/static/images/google.jpg

app.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
});
