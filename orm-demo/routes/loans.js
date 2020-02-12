var express = require('express');
var router = express.Router();
const { Loan, Interest } = require("../db/models");


// CUSTOM ERRORS
const { IdNotFound, ElementAlreadyDeleted, DuplicateElement } = require("../src/errors/customErrors");

let response = {
    error: false,
    code: 200,
    message: ''
};

const defaultErrorResponse = (error) => {
    response = {
        error: true,
        code: 500,
        message: error.name + ': ' + error.message
    }
    return response;
}

let loan = {
    date: '',
    amount: '',
    payments: '',
    status: '',
    interest: ''
}
const PENDING_STATUS = "PENDIENTE";

router.route("/")
    /* Saves a new loan */
    .post(async (req, res) => {
        const loan = req.body;

        try {
            insertIds = await Loan.create(loan);

            response = {
                error: false,
                code: 200,
                message: "Prestamo creado!",
                insertIds: insertIds
            };

        } catch (error) {
            if (error.code == "ER_DUP_ENTRY") {
                response = {
                    error: true,
                    code: 409,
                    message: error.message
                };
            } else {
                response = defaultErrorResponse(error);
            }
            console.log(error);
        }
        res.status(response.code).send(response);

    })

    /* Gets all the loans */
    .get(async (req, res) => {
        try {
            loansList = await Loan.findAll({ include: { model: Interest, as: 'interest' }, attributes: { exclude: ["interest_id"] } }); //include para que tambien traiga el interes completo al leer.

            response = {
                error: false,
                code: 200,
                message: "Peticion correcta",
                response: loansList
            };

        } catch (error) {
            response = defaultErrorResponse(error);

            console.log(error);
        }
        res.status(response.code).send(response);
    })
/* A PARTIR DE ACA HECHO SIN ORM 
router.delete("/:loan_id", async (req, res) => {
    try {
        results = await deleteLoan(req.params.loan_id);

        response = {
            error: false,
            code: 200,
            message: "Prestamo eliminado!",
            results: results
        };

    } catch (error) {
        if (error.name == "IdNotFound") {
            response = {
                error: true,
                code: 400,
                message: error.message
            };
        } else if (error.name == "ElementAlreadyDeleted") {
            response = {
                error: true,
                code: 400,
                message: error.message
            };
        } else {
            response = defaultErrorResponse(error);
        }

        console.log(error);
    }
    res.status(response.code).send(response);
})

router.put("/:loan_id", async (req, res) => {
    let id = req.params.loan_id;
    let loan = req.body;

    try {
        results = await updateLoan(id, loan);
        response = {
            error: false,
            code: 200,
            message: "Prestamo actualizado!",
            results: results
        };

    } catch (error) {
        if (error.name == "IdNotFound") {
            response = {
                error: true,
                code: 400,
                message: error.message
            };
        } else {
            response = defaultErrorResponse(error)
        }
        console.log(error);
    }
    res.status(response.code).send(response);
})

router.get("/:loan_id", async (req, res) => {
    try {
        loan = await getLoanById(req.params.loan_id);

        response = {
            error: false,
            code: 200,
            message: "Peticion correcta",
            loan: loan
        };

    } catch (error) {
        if (error.name == "IdNotFound") {
            response = {
                error: true,
                code: 400,
                message: "No existe prestamo con ese id",
            }
        } else {
            response = defaultErrorResponse(error);
        }
        console.log(error);
    }
    res.status(response.code).send(response);
})

router.get("/getByDni/:dni", async (req, res) => {
    try {
        loansList = await getLoansByDni(req.params.dni);

        response = {
            error: false,
            code: 200,
            message: "Peticion correcta",
            loansList: loansList
        };
    } catch (error) {
        if (error.name == IdNotFound.name) {
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

// --------- DB FUNCTIONS ---------------
async function saveLoan(loan) {
    let connection;
    let insertIds = { // to return the ids of the created user and loan
        user_id: -1,
        loan_id: -1
    }
    try {
        connection = await dbConnection();
        await connection.beginTransaction();
        const userResponse = await usersRoute.saveUser(loan.user, connection);

        let user_id = userResponse[0].insertId;
        console.log("USERID: " + user_id);

        const results = await connection.query('INSERT INTO loans(date, amount, payments, status, user_id, interest_id) VALUES(?,?,?,?,?,?)',
            [loan.date, loan.amount, loan.payments, PENDING_STATUS, user_id, loan.interest_id]);

        insertIds.user_id = user_id;
        insertIds.loan_id = results[0].insertId;
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    }
    connection.end();
    return insertIds;
}

async function getAll() {
    let connection;
    let loansList = new Array();
    try {
        connection = await dbConnection();
        let results = await connection.query('SELECT lo.loan_id, lo.date, lo.amount, lo.payments, lo.status, lo.deleted as loan_deleted, us.user_id, us.dni, us.cuil_cuit, us.gender, us.first_name, us.last_name, us.address, us.phone_number, us.province, us.city, us.email, us.cbu, us.new_user, us.score, us.debtor, us.deleted as user_deleted, i.interest_id, i.percentage, i.type, i.deleted as interest_deleted FROM loans lo inner join users us on lo.user_id = us.user_id inner join interests i on lo.interest_id = i.interest_id ');

        for (const element of results[0]) {

            user = {
                user_id: element.user_id,
                dni: element.dni,
                cuil_cuit: element.cuil_cuit,
                gender: element.gender,
                first_name: element.first_name,
                last_name: element.last_name,
                address: element.address,
                phone_number: element.phone_number,
                province: element.province,
                city: element.city,
                email: element.email,
                cbu: element.cbu,
                new_user: !!element.new_user,
                score: element.score,
                debtor: element.debtor,
                deleted: !!element.user_deleted,
                dni_urls: await usersRoute.getDniUrlsByUserId(element.user_id)
            };

            interest = {
                interest_id: element.interest_id,
                percentage: element.percentage,
                type: element.type,
                deleted: !!element.interest_deleted
            };

            loan = {
                loan_id: element.loan_id,
                date: element.date,
                amount: element.amount,
                payments: element.payments,
                status: element.status,
                deleted: !!element.loan_deleted,
                user: user,
                interest: interest
            };

            loansList.push(loan);
        }
    } catch (error) {
        throw error;
    }
    connection.end();
    return loansList;
}

async function deleteLoan(loan_id) {
    let connection;
    let results;
    try {
        connection = await dbConnection();
        results = await connection.query('UPDATE loans SET deleted = true WHERE loan_id = ?', [loan_id]);
        if (results[0].affectedRows == 0) {
            throw new IdNotFound("No existe un prestamo con ese id");
        }
        if (results[0].changedRows == 0) {
            throw new ElementAlreadyDeleted("El prestamo ya se encuentra eliminado");
        }
    } catch (error) {
        throw error;
    }
    connection.end();
    return results;
}

async function updateLoan(id, loan) {
    let connection;
    let results;
    try {
        connection = await dbConnection();
        results = await connection.query('UPDATE loans SET date = ?, amount = ?, payments = ?, status = ? WHERE loan_id = ?', [loan.date, loan.amount, loan.payments, loan.status, id]);
        if (results[0].affectedRows == 0) {
            throw new IdNotFound("No existe prestamo con ese id");
        }
    } catch (error) {
        throw error;
    }
    connection.end();

    return results;
}

async function getLoanById(loan_id) {
    let connection;
    let loan;
    try {
        connection = await dbConnection();
        let results = await connection.query('SELECT lo.loan_id, lo.date, lo.amount, lo.payments, lo.status, lo.deleted as loan_deleted, us.user_id, us.dni, us.cuil_cuit, us.gender, us.first_name, us.last_name, us.address, us.phone_number, us.province, us.city, us.email, us.cbu, us.new_user, us.score, us.debtor, us.deleted as user_deleted, i.interest_id, i.percentage, i.type, i.deleted as interest_deleted FROM loans lo inner join users us on lo.user_id = us.user_id inner join interests i on lo.interest_id = i.interest_id WHERE lo.loan_id = ?',
            [loan_id]);

        if (!results[0][0]) {
            throw new IdNotFound("No existe prestamo con ese id");
        }

        let user = {
            user_id: results[0][0].user_id,
            dni: results[0][0].dni,
            cuil_cuit: results[0][0].cuil_cuit,
            gender: results[0][0].gender,
            first_name: results[0][0].first_name,
            last_name: results[0][0].last_name,
            address: results[0][0].address,
            phone_number: results[0][0].phone_number,
            province: results[0][0].province,
            city: results[0][0].city,
            email: results[0][0].email,
            cbu: results[0][0].cbu,
            new_user: !!results[0][0].new_user,
            score: results[0][0].score,
            debtor: results[0][0].debtor,
            deleted: !!results[0][0].user_deleted,
            dni_urls: await usersRoute.getDniUrlsByUserId(results[0][0].user_id)
        };

        let interest = {
            interest_id: results[0][0].interest_id,
            percentage: results[0][0].percentage,
            type: results[0][0].type,
            deleted: !!results[0][0].interest_deleted
        };

        loan = {
            loan_id: results[0][0].loan_id,
            date: results[0][0].date,
            amount: results[0][0].amount,
            payments: results[0][0].payments,
            status: results[0][0].status,
            deleted: !!results[0][0].loan_deleted,
            user: user,
            interest: interest
        };

    } catch (error) {
        throw error;
    }
    connection.end();
    return loan;
}

async function getLoansByDni(dni) {
    let connection;
    let loansList = new Array();
    try {
        connection = await dbConnection();
        let results = await connection.query('SELECT lo.loan_id, lo.date, lo.amount, lo.payments, lo.status, lo.deleted as loan_deleted, us.user_id, us.dni, us.cuil_cuit, us.gender, us.first_name, us.last_name, us.address, us.phone_number, us.province, us.city, us.email, us.cbu, us.new_user, us.score, us.debtor, us.deleted as user_deleted, i.interest_id, i.percentage, i.type, i.deleted as interest_deleted FROM loans lo inner join users us on lo.user_id = us.user_id inner join interests i on lo.interest_id = i.interest_id WHERE us.dni = ?',
            [dni]);

        if (!results[0][0]) {
            throw new IdNotFound("El usuario no tiene prestamos o no existe");
        }

        for (const element of results[0]) {

            user = {
                user_id: element.user_id,
                dni: element.dni,
                cuil_cuit: element.cuil_cuit,
                gender: element.gender,
                first_name: element.first_name,
                last_name: element.last_name,
                address: element.address,
                phone_number: element.phone_number,
                province: element.province,
                city: element.city,
                email: element.email,
                cbu: element.cbu,
                new_user: !!element.new_user,
                score: element.score,
                debtor: element.debtor,
                deleted: !!element.user_deleted,
                dni_urls: await usersRoute.getDniUrlsByUserId(element.user_id)
            };

            interest = {
                interest_id: element.interest_id,
                percentage: element.percentage,
                type: element.type,
                deleted: !!element.interest_deleted
            };

            loan = {
                loan_id: element.loan_id,
                date: element.date,
                amount: element.amount,
                payments: element.payments,
                status: element.status,
                deleted: !!element.loan_deleted,
                user: user,
                interest: interest
            };

            loansList.push(loan);
        }

    } catch (error) {
        throw error;
    }
    connection.end();
    return loansList;
}
*/

module.exports = router;