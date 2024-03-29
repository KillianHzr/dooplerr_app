// models/episode.js
const sequelize = require('./_database');
const { DataTypes } = require('sequelize');

const Episode = sequelize.define('Episode', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    release_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true
        }
    },
    duration: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            isPositive: true
        }
    },
    file_path: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Episode;

