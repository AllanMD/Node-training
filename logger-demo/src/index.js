const express = require("express");
const logger = require("./utils/logger");

const app = express();

app.get("/", (req, res)=>{
    logger.info("Usuario autenticado!");// reemplaza al "console.log()"
    logger.warn("Warning logger");
    logger.error("Error logger");
    logger.debug("Debug logger");    
    
    res.status(200).send("Hola!");

})

app.listen(3000, ()=> {
    logger.info("Servidor inicializado!");
})