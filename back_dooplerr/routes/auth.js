const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require('../models/User');
const { Op } = require('sequelize');
const { authentificationMiddleware } = require("../middlewares/authentification");

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

// Route pour la connexion
router.post('/login', passport.authenticate('local'), (req, res) => {
    const token = req.user.generateJwtToken();
    res.json({ message: 'Connexion réussie', user: req.user, token });
  });

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  const token = req.user.generateJwtToken();
  res.redirect(`${process.env.FRONTEND_URL}/auth/login?token=${token}`);
});

// Route pour obtenir les informations de l'utilisateur connecté
router.get('/me', authentificationMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des informations de l'utilisateur." });
  }
});

// Route pour la déconnexion
router.get("/logout", function (req, res) {
  req.logout();
  res.json({ message: "Déconnexion réussie" });
});

module.exports = router;
