//incluimos redis a nuestro script
var redis = require('redis');

module.exports = () => {
    //creamos un cliente
    var redisClient = redis.createClient();

    redisClient.on('connect', function () {
        console.log('Conectado a Redis Server');
    });

    redisClient.set("key1", "hola mundo1");
    redisClient.set("key2", "hola mundo2");
    redisClient.set("key3", "hola mundo2");
    redisClient.get("key1", function (err, value) {
        // retornara null si la key no existe
        console.log(value);
    });

    redisClient.exists("key1", function (err, reply) {
        if (err != null) {
            //error
            console.log("halo")
        }
        else {
            console.log("sfa");
        }
    });
    //TODO: borrar los ejemplos
    //  redisClient.set(["key1", "val1","val2","val3","val4"]); //Tomara el primer elemento del array y lo usara como un identificar y los demás elementos serán los valores.

}