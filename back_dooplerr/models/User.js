require('dotenv').config();

const bcrypt = require('bcrypt');
const sequelize = require('./_database');
const { DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

// Définition du modèle User avec les différentes propriétés
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
        type: DataTypes.STRING(500),
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
    }
});

// Méthode pour générer un jeton JWT (JSON Web Token) pour l'utilisateur
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

// Hook exécuté avant la création d'un utilisateur pour hasher le mot de passe
User.beforeCreate(async (user, options) => {
    user.password = await User.hashPassword(user.password);
});

// Méthode statique pour hasher le mot de passe
User.hashPassword = async function(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

// Méthode pour valider le mot de passe de l'utilisateur
User.prototype.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};  

module.exports = User;