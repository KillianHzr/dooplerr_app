const sequelize = require('./_database');
const { DataTypes } = require('sequelize');

const EpisodeComment = sequelize.define('EpisodeComment', {
});

module.exports = EpisodeComment;
