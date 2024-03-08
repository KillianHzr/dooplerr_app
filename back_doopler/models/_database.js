// Initialisation de la connexion à la BDD
const Sequelize = require('sequelize');

const sequelizeInstance = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: 'localhost', 
        port: 8889,
        dialect: 'mysql'
    }
)

module.exports = sequelizeInstance