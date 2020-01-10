//incluimos redis a nuestro script
var redis = require('redis');

// para entender module.exports : https://www.sitepoint.com/understanding-module-exports-exports-node-js/
const getConnection = () => {
    var redisClient = redis.createClient();

    redisClient.on('connect', function () {
        console.log('Conectado a Redis Server');
    });

    return redisClient;
}

exports.set = function (key, value) {
    let redisClient = getConnection();
    redisClient.set(key, value);
    redisClient.expire(key, 120); //https://redis.io/commands/expire // el tiempo es en segundos
    redisClient.quit();
}

exports.get = function (key, callback) {
    let redisClient = getConnection();
    redisClient.get(key, function (err, value) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, value);
        }
    });
    redisClient.quit();
}

exports.getAllKeys = function (callback) {
    let redisClient = getConnection();
    redisClient.keys("'*'", function (err, value) {
        if (err) {
            console.log("Error");
            return callback(err);
        } else {
            console.log("value");
            return callback(null, value);
        }
    })
    redisClient.quit();
}

exports.exists = function (key, callback) {
    let redisClient = getConnection();
    redisClient.exists(key, function (err, reply) {
        if (err) {
            console.log("Error: " + err);
            return callback(err);
        } else {
            return callback(null, reply);
        }
    });
    redisClient.quit();
}

exports.delete = function (key, callback) {
    let redisClient = getConnection();
    redisClient.del(key, function (err, reply) {
        if (err) {
            console.log("Error: " + err);
            return callback(err);
        } else {
            return callback(null, reply);
        }
    });
    redisClient.quit();
}

// redisClient.set(["key1", "val1","val2","val3","val4"]); //Tomara el primer elemento del array y lo usara como un identificar y los demás elementos serán los valores.
// en redis-cli,el comando: keys '*' sirve para ver todas las keys guardadas.