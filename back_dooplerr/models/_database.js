// Initialisation de la connexion à la BDD
const Sequelize = require('sequelize');

const sequelizeInstance = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST, 
        port: process.env.DB_PORT,
        dialect: 'mysql'
    }
)

module.exports = sequelizeInstance