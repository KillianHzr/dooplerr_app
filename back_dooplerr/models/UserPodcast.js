const sequelize = require('./_database');
const { DataTypes } = require('sequelize');

const UserPodcast = sequelize.define('UserPodcast', {
});

module.exports = UserPodcast;