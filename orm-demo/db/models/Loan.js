const { Model } = require('sequelize');

class Loan extends Model {

    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            date: {
                allowNull: false,
                type: DataTypes.DATE,
                validate: {
                    notNull: { msg: 'Date is required.' }
                }
            },
            amount: {
                allowNull: false,
                type: DataTypes.DOUBLE,
                validate: {
                    notNull: { msg: 'Amount is required.' }
                }
            },
            payments: {
                allowNull: false,
                type: DataTypes.INTEGER,
                validate: {
                    notNull: { msg: 'Payments is required.' }
                }
            },
            status: {
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    notNull: { msg: 'Status name is required.' }
                }
            },
            deleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
        }, {
            sequelize,
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            }
        });
    }

    // esto hace una suerte de join con la tabla interest
    static associate(models) {
        this.interest = this.belongsTo(models.Interest, { foreignKey: 'interest_id', as: "interest" }); // as: para darle un alias a la asociacion. de forma que cuando traigamos el registro entero de interest, se muestre con ese alias
    }

}

module.exports = Loan;
