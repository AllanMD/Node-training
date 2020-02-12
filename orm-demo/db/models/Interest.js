const { Model } = require('sequelize');
//MODELS: los modelos representan cada tabla de la bd. y los usa sequelize para relacionar los datos con los de la bd.
class Interest extends Model {

    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            percentage: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                unique: true,
                validate: {
                    notNull: { msg: 'percentage is required.' }, //https://sequelize.org/master/manual/validations-and-constraints.html
                }
            },
            type: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            deleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        }, {
            sequelize,
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] } // para que ignore esos dos campos al leer datos de la bd.
            }
        });
    }

}

module.exports = Interest;
