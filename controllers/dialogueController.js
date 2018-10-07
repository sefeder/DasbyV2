// ==================================================================================================
// The following code should go into its own file in "models" folder once sequelize is removed
var mysql = require("mysql2");
require('dotenv').config();


// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.DBUSER,
    password: process.env.PASS,
    database: process.env.DATABASE
});

// connect to the mysql server and sql database

// ==================================================================================================

const db = require('../models')

module.exports = {
    readDasbyScript: function (req, res) {
        console.log("read dasby script")
        console.log(process.env.DBUSER)
        const chapter = req.body.chapter;
        const section = req.body.section;
        const block = req.body.block;
        const table = "dialogue";
    
        // connection.connect(function (err) {
        //     if (err) console.log(err);
            console.log("database connected!!!")
            const queryString = 'SELECT * FROM ' + table + ' WHERE `chapter` = ? AND `section` = ? AND `block` > ? ORDER BY `block`';
            connection.query(
                queryString,
                [chapter, section, block - 1],
                function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(results)
                        res.json(results);
                        // connection.end()
                    }
                }
            );
        // });

    },

}
