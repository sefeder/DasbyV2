module.exports = function (sequelize, DataTypes) {

    var User = sequelize.define("User", {
       
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        hospital: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'UChicago'
        },
        upi: {
            type: DataTypes.STRING,
            allowNull: true
        },
        private_key: {
            //need to figure out correct datatype to store private key array
            type: DataTypes.JSON,
            default: {"key": "value"},
            allowNull: true
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user',
            allowNull: false
        }
    })

    return User;

};