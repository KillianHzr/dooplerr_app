const sequelize = require('./_database');
const { DataTypes } = require('sequelize');

const PodcastCategory = sequelize.define('PodcastCategory', {
});

module.exports = PodcastCategory;