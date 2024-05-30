// models/comment.js
const sequelize = require('./_database');
const { DataTypes } = require('sequelize');

const Comment = sequelize.define('Comment', {
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }

});

module.exports = Comment;