const sequelize = require('./_database');
const { DataTypes } = require('sequelize');

const UserComment = sequelize.define('UserComment', {
});

module.exports = UserComment;