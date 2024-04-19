const bcrypt = require('bcrypt');
const sequelize = require('./_database');
const { DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image_path: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM('user', 'creator'),
        allowNull: false,
        defaultValue: 'user',
        validate: {
            isIn: [['user', 'creator']]
        }
    },
    google_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    facebook_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    apple_id: {
        type: DataTypes.STRING,
        allowNull: true
    }

});

User.prototype.generateJwtToken = function() {
    const payload = {
        id: this.id,
        email: this.email,
        role: this.role
    };
    const options = {
        expiresIn: '1d'
    };
    const token = jwt.sign(payload, secret, options);
    return token;
};

User.beforeCreate(async (user, options) => {
    user.password = await User.hashPassword(user.password);
});

User.hashPassword = async function(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

User.prototype.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};  

module.exports = User;