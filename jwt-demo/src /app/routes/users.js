var express = require('express');
var router = express.Router();

//JWT
const jwt = require('jsonwebtoken')

const jwtKey = 'my_secret_key' // clave secreta que se usa para codificar el token
/*Es importante que esta clave permanezca lo más oculta posible. Una opción es almacenarla 
en un fichero config.js y ese fichero no subirlo al repositorio con .gitignore o la opción 
mejor es utilizar una variable de entorno (con process.env) que esté en nuestro servidor, y otra para nuestro entorno de desarrollo.
*/
const jwtExpirySeconds = 300

let user = { // usuario para probar login
    mail: "allan",
    pass: "1234"
}

let response = {
    error: false,
    code: 200,
    message: ''
};

/**
 * Funcion que autentica mediante un token una llamada a una api
 */
function auth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send({ message: "La peticion no tiene token" });
    }
    var payload;
    try {
        // Parse the JWT string and store the result in `payload`.
        // Note that we are passing the key in this method as well. This method will throw an error
        // if the token is invalid (if it has expired according to the expiry time we set on sign in),
        // or if the signature does not match
        payload = jwt.verify(token, jwtKey)
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            // if the error thrown is because the JWT is unauthorized, return a 401 error
            return res.status(401).send("Token incorrecto");
        }
        // otherwise, return a bad request error
        return res.status(400).send("bad request");
    }
    next();// en caso de que todo este bien, con el next() se pasa el control a la siguiente funcion middleware

};


router.post("/login", function (req, res) {
    const { mail, pass } = req.body;
    if (mail != user.mail) {
        response = {
            error: true,
            code: 401,
            message: "Usuario no existe"
        };
    } else if (pass != user.pass) {
        response = {
            error: true,
            code: 401,
            message: "Contraseña incorrecta"
        }
    } else {
        let token = jwt.sign({ mail }, jwtKey, { // mail: el dato que uno desee guardar en el token // jwtKey: la clave que se va a usar para codificar el token
            algorithm: 'HS256',
            expiresIn: jwtExpirySeconds // tiempo en segundos en el q expira el token
        });
        console.log("TOKEN: " + token);
        response = {
            error: false,
            code: 200,
            message: "Login exitoso!",
            token: token
        };
        // set the cookie as the token string, with a similar max age as the token
        // here, the max age is in milliseconds, so we multiply by 1000
        res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 })
    }

    res.status(response.code).send(response);

});

router.post("/refresh", auth, (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send({ message: "La peticion no tiene token" });
    }
    var payload; // the payload contains application specific information (in our case, this is the email), along with information about the expiry and validity of the token.
    try {
        payload = jwt.verify(token, jwtKey)
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            // if the error thrown is because the JWT is unauthorized, return a 401 error
            return res.status(401).send("Token incorrecto");
        }
        // otherwise, return a bad request error
        return res.status(400).send("bad request");
    }

    const nowUnixSeconds = Math.round(Number(new Date()) / 1000) // el tiempo unix es un sistema para medir el tiempo.
    // si el token todavia tiene tiempo de vida, no hace la renovacion:
    if (payload.exp - nowUnixSeconds > 30) { // payload.exp obtiene info acerca de la expiracion del token
        return res.status(400).send({ message: "Token todavia tiene vida util(?, pruebe mas tarde" })
    }

    // Now, create a new token for the current user, with a renewed expiration time
    const newToken = jwt.sign({ username: payload.username }, jwtKey, {
        algorithm: 'HS256',
        expiresIn: jwtExpirySeconds
    })

    // Set the new token as the users `token` cookie
    res.cookie('token', newToken, { maxAge: jwtExpirySeconds * 1000 })
    res.status(200).send({ message: "Token renovado!" });
});

router.delete("/logout", auth, (req, res) => {
    // https://expressjs.com/en/4x/api.html#res.clearCookie
    res.clearCookie('token');

    res.status(response.code).send("exito al desloguear");

})
/**
 * Api que requiere autorizacion con token para probar
 */
router.get("/", auth, (req, res) => {
    res.send("hola");
})

module.exports = router;

//TUTORIAL USADO: https://www.sohamkamani.com/blog/javascript/2019-03-29-node-jwt-authentication/#renewing-your-token