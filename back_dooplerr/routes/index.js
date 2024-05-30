const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Episode, Podcast, Comment, Category, User, UserComment, EpisodeComment } = require("../models/index");
const { authentificationMiddleware } = require("../middlewares/authentification");

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
        include: [
          {
            model: User,
            attributes: ['username']
          }
        ]
      }
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
router.post("/episodes/:id/comments", authentificationMiddleware, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Aucun utilisateur n'est connecté." });
  }

  try {
    const { text } = req.body;
    const date = new Date();
    const episode = await Episode.findByPk(req.params.id);

    if (!episode) {
      return res.status(404).json({ error: "L'épisode spécifié n'existe pas." });
    }

    const comment = await Comment.create({
      text: text,
      date: date,
      EpisodeId: episode.id,
    });

    await UserComment.create({
      UserId: req.user.id,
      CommentId: comment.id
    });

    await EpisodeComment.create({
      EpisodeId: episode.id,
      CommentId: comment.id
    });

    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création du commentaire." });
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
