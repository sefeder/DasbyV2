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
            type: DataTypes.STRING,
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