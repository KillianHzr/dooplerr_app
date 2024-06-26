// models/podcast.js
const sequelize = require('./_database');
const { DataTypes } = require('sequelize');

const Podcast = sequelize.define('Podcast', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    thumbnail_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    public: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

module.exports = Podcast;