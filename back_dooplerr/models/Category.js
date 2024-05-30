// models/comment.js
const sequelize = require('./_database');
const { DataTypes } = require('sequelize');


const Category = sequelize.define('Category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = Category;