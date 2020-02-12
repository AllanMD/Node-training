var express = require('express');
var router = express.Router();
const { Interest } = require("../db/models");

//CUSTOM ERRORS
const { IdNotFound, ElementAlreadyDeleted, DuplicateElement } = require("../src/errors/customErrors");

let response = {
    error: false,
    code: 200,
    message: ''
};

let interest = {
    percentage: 0,
    type: ''
}

const defaultErrorResponse = (error) => {
    response = {
        error: true,
        code: 500,
        message: error.name + ': ' + error.message
    }
    return response;
}

router.route("/")
    /* Saves a new interest */
    .post(async (req, res) => {
        const interest = req.body;

        try {
            const results = await Interest.create(interest); // mediante el Model, se hce la comunicacion con la bd // https://sequelize.org/master/manual/model-querying-basics.html
            response = {
                error: false,
                code: 200,
                message: "Interes creado!",
                results: results // o se puede devolver solo el id.
            };
        } catch (error) {
            if (error.name == "SequelizeUniqueConstraintError") {
                response = {
                    error: true,
                    code: 500,
                    message: "Ya existe ese interes (DUPLICATE KEY)"
                }
            } else {
                response = defaultErrorResponse(error);
            }
            console.log(error);
        }
        res.status(response.code).send(response);
    })

    /* Gets all the interests of the db */
    .get(async (req, res) => {
        try {
            interestsList = await Interest.findAndCountAll(); // o findAll();
            response = {
                error: false,
                code: 200,
                message: "Peticion correcta",
                interestsList: interestsList
            };
        } catch (error) {
            response = defaultErrorResponse(error);
            console.log(error);
        }
        res.status(response.code).send(response);
    })

/* Makes a logical deletion of an interest*/
router.delete("/:interest_id", async (req, res) => {
    try {
        results = await Interest.update({ deleted: true }, { where: { id: req.params.interest_id } }); // borrado logico, para borrar el registro usar .destroy
        if (results[0] == 0) {
            throw new IdNotFound("No existe interes con ese id");
        }
        response = {
            error: false,
            code: 200,
            message: "Interes eliminado!",
            results: results
        };

    } catch (error) {
        if (error.name == IdNotFound) {
            response = {
                error: true,
                code: 400,
                message: error.name
            };
        } else if (error.name == "ElementAlreadyDeleted") {
            response = {
                error: true,
                code: 400,
                message: error.message
            };
        }
        else {
            response = defaultErrorResponse(error);
        }
        console.log(error);
    }
    res.status(response.code).send(response);
})

/* Updates an interest */
router.put("/:interest_id", async (req, res) => {
    let id = req.params.interest_id;
    let interest = req.body;
    try {
        results = await Interest.update({ percentage: interest.percentage, type: interest.type }, { where: { id: id } });// al hacer update, actualiza automaticamente el campo "updatedAt" en la bd
        if (results[0] == 0) {
            throw new IdNotFound("No existe interes con ese id");
        }
        response = {
            error: false,
            code: 200,
            message: "Interes actualizado!",
            results: results
        };

    } catch (error) {
        if (error.name == "SequelizeUniqueConstraintError") {
            response = {
                error: true,
                code: 400,
                message: "Ya existe ese interes (DUPLICATE KEY)"
            }
        } else if (error.name == "IdNotFound") {
            response = {
                error: true,
                code: 400,
                message: error.message,
            };
        } else {
            response = defaultErrorResponse(error);
        }
        console.log(error);

    }
    res.status(response.code).send(response);
})

/* Gets an interest by his id */
router.get("/:interest_id", async (req, res) => {
    try {
        interest = await Interest.findByPk(req.params.interest_id); //https://sequelize.org/v5/manual/models-usage.html
        if (interest == null) {
            throw new IdNotFound("No existe interes con ese id");
        }
        response = {
            error: false,
            code: 200,
            message: "Peticion correcta",
            interest: interest
        };

    } catch (error) {
        if (error.name == "IdNotFound") {
            response = {
                error: true,
                code: 400,
                message: error.message
            }
        } else {
            response = defaultErrorResponse(error);
        }
        console.log(error);
    }
    res.status(response.code).send(response);
})

// --------- FUNCIONES DE BD SIN ORM ----------

async function save(interest) {
    let connection;
    let results;
    try {
        connection = await dbConnection();

        results = await connection.query('INSERT INTO interests(percentage, type) VALUES(?,?)', [interest.percentage, interest.type]);
    } catch (error) {
        throw error;
    }
    connection.end();
    return results;
}

async function getAll() {
    let connection;
    let interestsList = new Array();
    try {
        connection = await dbConnection();
        let results = await connection.query('SELECT interest_id, percentage, type, deleted FROM interests');

        for (const element of results[0]) {
            interest = {
                interest_id: element.interest_id,
                percentage: element.percentage,
                type: element.type,
                deleted: !!element.deleted
            }
            interestsList.push(interest);
        }
    } catch (error) {
        throw error;
    }
    connection.end();
    return interestsList;
}

async function deleteInterest(interest_id) {
    let connection;
    let results;
    try {
        connection = await dbConnection();
        results = await connection.query('UPDATE interests SET deleted = true WHERE interest_id = ?', [interest_id]);
        if (results[0].affectedRows == 0) {
            throw new IdNotFound("No existe un interes con ese id");
        }
        if (results[0].changedRows == 0) {
            throw new ElementAlreadyDeleted("El interes ya se encuentra eliminado");
        }
    } catch (error) {
        throw error;
    }

    connection.end();
    return results;
}

async function updateInterest(id, interest) {
    let connection;
    let results;
    try {
        connection = await dbConnection();
        results = await connection.query('UPDATE interests SET percentage = ?, type = ? WHERE interest_id = ?', [interest.percentage, interest.type, id]);
        if (results[0].affectedRows == 0) {
            throw new IdNotFound("No existe interes con ese id");
        }

    } catch (error) {
        throw error;
    }
    connection.end();
    return results;
}

async function getById(interest_id) {
    let connection;
    let interest;
    try {
        connection = await dbConnection();
        let results = await connection.query('SELECT interest_id, percentage, type, deleted FROM interests WHERE interest_id = ?'
            , [interest_id]);
        if (!results[0][0]) {
            throw new IdNotFound("No existe interes con ese id");
        }
        interest = {
            interest_id: results[0][0].interest_id,
            percentage: results[0][0].percentage,
            type: results[0][0].type,
            deleted: !!results[0][0].deleted
        }
    } catch (error) {
        throw error;
    }
    connection.end();
    return interest;
}
module.exports = router;