const { sequelizeInstance } = require('../sqlQuery');

sequelizeInstance.sync({ alter: true });

module.exports = []