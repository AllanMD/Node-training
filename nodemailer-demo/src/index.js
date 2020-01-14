const express = require('express');
const app = express();
const path = require('path'); // para saber en q carpeta me ubico
const bodyParser = require('body-parser'); // para manejo de datos por post 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var emails = require('./routes/emails');

app.use("/emails", emails); 

app.listen(3000, () =>{
    console.log("Servidor inicializado en el puerto 3000");
})