/************************************************
 Imports 
************************************************/
const dbPool = require("../mysql/db");

/************************************************
 Tables 
************************************************/
const table = "dialogue";

/************************************************
 Queries 
************************************************/
find = function (chapter, section, block) {
	dbPool.getConnection(function(error, connection) {
        return new Promise((resolve,reject) =>{
            if (error) {
                console.log(error);
            }
            else{
                const queryString = 'SELECT * FROM ' +  table + ' WHERE `chapter` = ? AND `section` = ? AND `block` > ? ORDER BY `block`';
                connection.query(
                    queryString,
                    [chapter, section, block-1],
                    function(err, results) {
                        if (err) {
                            console.log(err);
                        }
                        else{
                            resolve(results);
                        }
                    }
                );
                dbPool.releaseConnection(connection);
            }
        });
    })

}

/************************************************
 Modules 
************************************************/
module.exports = {find}