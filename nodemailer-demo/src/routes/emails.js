var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');

router.post("/", async (req, res) => {
    const { email, subject, message } = req.body; // guarda el email y message del body en las variables "email, message". de esta forma no tnemos q hacer req.body.email o req.body.message

    // aca se especifica que servicio SMTP vamos a usar para entregar los correos
    // usamos el serivcio que provee esta pagina: https://ethereal.email/
    // te genera un usuario y contraseña para usarla. 
    // la pagina simula el comportamiento de un servicio SMTP , y no envia los correos al destinario
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: 'emile57@ethereal.email',
            pass: 'n2WACUZ1sd541xfKGu'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    contentHTML = `
    <h1>Asunto: ${subject} </h1>
    <ul>
        <li> Mensaje: ${message}</li>
    </ul>
    `;
    try {
        const info = await transporter.sendMail({
            from: "'probando nodemailer' <probando@hola.com",
            to: email,
            subject: subject,
            text: message, // puedo enviar texto o html
            html: contentHTML // se puede enviar el contenido en formato html si deseamos
        });
        console.log("Mensaje enviado", info.messageId)
        res.status(200).send(("recibido"));
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }

    //los mails enviados se visualizan en: https://ethereal.email/messages
})

module.exports = router;

// tutorial usado: https://www.youtube.com/watch?v=wu-1LpCyu1Y 