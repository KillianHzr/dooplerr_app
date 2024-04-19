const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require('../models/User');
const { Op } = require('sequelize');

// Route pour l'inscription
router.post("/register", async (req, res) => {
  try {
    const { username, email, firstname, lastname, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });
    if (existingUser) {
      return res.status(400).json({
        error: "Cet utilisateur existe déjà. Veuillez vous connecter.",
      });
    }

    // Créer un nouvel utilisateur
    const newUser = await User.create({
      username,
      email,
      firstname,
      lastname,
      password,
    });

    res.json({ message: "Inscription réussie", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'inscription." });
  }
});

// Routep pour la connexion
router.post('/login', passport.authenticate('local'), (req, res) => {
    const token = req.user.generateJwtToken();
    res.json({ message: 'Connexion réussie', user: req.user, token });
  });

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    const token = req.user.generateJwtToken();
    res.json({ message: 'Connexion réussie', user: req.user, token });
});

router.get('/apple', passport.authenticate('apple'));

router.get('/apple/callback', passport.authenticate('apple'), (req, res) => {
    const token = req.user.generateJwtToken();
    res.json({ message: 'Connexion réussie', user: req.user, token });
});


// Route pour la déconnexion
router.get("/logout", function (req, res) {
  req.logout();
  res.json({ message: "Déconnexion réussie" });
});

module.exports = router;
