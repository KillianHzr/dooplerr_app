const mysql = require('mysql');
const { Sequelize, DataTypes } = require('sequelize');

sequelizeInstance = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD ,
    {
        host: 'localhost',
        dialect: 'mysql'
    }
);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

function sqlQuery(query, values, callback) {
    pool.getConnection((connError, connection) => {
        if (connError) {
            console.error(connError);
            throw new Error('Connection error ' + connError);
        }
        try {
            connection.query(query, values, (error, result) => {
                if (error) {
                    console.error(error);
                    throw new Error('Query error ' + error);
                }
                callback(result);
            });
        } catch (error) {
            throw new Error('Unexpected error occurred: ' + error);
        }
        connection.release();
    });
}

module.exports = {
    sqlQuery,
    sequelizeInstance
};
