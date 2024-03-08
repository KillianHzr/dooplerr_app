const sequelize = require('./_database');
const { DataTypes } = require('sequelize');

const PodcastEpisode = sequelize.define('PodcastEpisode', {
});

module.exports = PodcastEpisode;