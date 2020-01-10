/*
        const connection = dbConnection();
        try {
            const [ results, fields ] = await connection.query('SELECT * FROM users');
            res.status(200).send(results);
        } catch (error) {
            res.status(500).send("Error obteniendo los usuarios de la bd");
        }
        connection.end();
         // es lo mismo que lo de abajo, hecho con async await. 

        const connection = dbConnection();
        connection.query('SELECT * FROM users', function (error, results, fields) {
            if (error) {
                res.status(500).send("Error obteniendo los usuarios de la bd");
            } else {
                res.status(200).send(results);
            }
        });
        connection.end();


        con mysql2, al hacer connection.query(), si no recibe un callback como parametro, devuelve una promise
        y mediante async y await manejamos esas promesas.
        callback y async/await son 2 maneras de manejar asincronismo.

        Aca adaptar un par de funciones del ejercicio anterior(login-with-token) usando async/await
        y mysql2 (ya q mysql2 es el q agrega la funcionalidad de devolver promesas).
        //https://www.adictosaltrabajo.com/2017/02/09/asyncawait-en-javascript/
    })*/