const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Episode, Podcast, Comment, Category, User } = require("../models/index");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("/!\\ DOOPLERR /!\\");
});

router.get("/podcasts", async (req, res) => {
  const podcasts = await Podcast.findAll({
    include: [Episode, Category],
  });
  res.json(podcasts);
});

router.get("/podcasts/:id", async (req, res) => {
  const podcast = await Podcast.findByPk(req.params.id, {
    include: Episode,
  });
  res.json(podcast);
});

router.get("/episodes", async (req, res) => {
  const episodes = await Episode.findAll({
    // Get podcast and comments for each episode
    include: [Podcast, Comment],
  });
  res.json(episodes);
});

router.get("/episodes/:id", async (req, res) => {
  const episode = await Episode.findByPk(req.params.id, {
    // Get podcast and comments for each episode with user
    include: [Podcast, 
      {
        model: Comment,
        include: User,
      },
    ],
  });
  res.json(episode);
});

// Route pour obtenir les commentaires de chaque épisode
router.get("/episodes/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: {
        episode_id: req.params.id,
      },
    });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des commentaires." });
  }
});

// Ajouter un commentaire à un épisode
router.post("/episodes/:id/comments", async (req, res) => {
  try {
    const { text, date } = req.body;
    const episode = await Episode.findByPk(req.params.id);

    if (!episode) {
      return res
        .status(404)
        .json({ error: "L'épisode spécifié n'existe pas." });
    }

    const comment = await episode.createComment({
      text: text,
      date: date,
    });

    res.json(comment);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création du commentaire." });
  }
});

// Route pour obtenir les catégories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.findAll(
      // Get podcast for each category
      { include: Podcast }
    );
    res.json(categories);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des catégories." });
  }
});

// Route pour obtenir les podcasts par catégorie
router.get("/categories/:id/podcasts", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: Podcast,
    });

    if (!category) {
      return res
        .status(404)
        .json({ error: "La catégorie spécifiée n'existe pas." });
    }

    res.json(category);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des podcasts." });
  }
});

module.exports = router;
