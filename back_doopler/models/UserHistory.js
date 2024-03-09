const sequelize = require('./_database');
const { DataTypes } = require('sequelize');

const UserHistory = sequelize.define('UserHistory', {
    listen_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

module.exports = UserHistory;