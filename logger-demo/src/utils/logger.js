const { createLogger, format, transports } = require("winston");

module.exports = createLogger({
    format: format.combine(
        format.simple(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.File({
            maxsize: 5120000, //en bytes
            maxFiles: 5, // cuando hayan 5 archivos logs, se elimina el primero. Se van eliminando uno tras otro
            filename: `${__dirname}/../logs/log-api.log`,
            level: "debug"
        }),
        new transports.Console({
            // existen distintos niveles de log, por ejemplo: error, warn (warning), info, etc.
            level: 'debug', // esto indica hasta que niveles de logger va a escuchar, mensajes con menor importancia que debug, no se mostraran
            // niveles: 1.error - 2.warn - 3.info - 4.verbose - 5.debug - 6.silly (-> importancia de mayor a menor ->)
        })
    ]
})

//tutorial usado: https://www.youtube.com/watch?v=axOHMgZznpo