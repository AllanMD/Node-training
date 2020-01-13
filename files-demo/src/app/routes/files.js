var express = require('express');
var router = express.Router();
const path = require('path');
var multer = require('multer') // para mutler

// para configurar la forma en q se guarda el archivo 
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'publics/uploads/'),
    filename: (req, file, cb) => {
        
        cb(null, Date.now() + ".jpg"); // configura bajo q nombre se guardan los archivos, el nombre de los archivos es la hora en q se sube
        // se puede usar tambien el nombre original del archivo mendiante file.originalname entre otras funciones del file.
    }
})
const upload = multer({
    storage,
    dest: path.join(__dirname, 'publics/uploads/'),  //destino donde va a guardar los archivos,
    limits : {fileSize: 8000000} // para poner un limite al tamaño, en bytes (este caso es 8MB)
});

let response = {
    error: false,
    code: 200,
    message: ''
};

router.route('/')
    // para probar el envio de imagenes con postman: en body poner "form-data" y en "key" poner la opcion "file"
    .post(upload.single("image"), (req, res) => { // se le pasa el middleware "upload" por parametro para que procese el archivo y lo guarde en req.file. Single xq vamos a recibir una a la vez, "image" el nombre del input (la key)
        console.log(req.file);
        res.send("uploaded!");

    })

module.exports = router;

// tutorial usado: https://www.youtube.com/watch?v=AbJ-y2vZgBs