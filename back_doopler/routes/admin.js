const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const { Episode, Podcast, Category, UserPodcast } = require("../models/index");
const { uploadToS3 } = require("../aws");
const { authentificationMiddleware } = require("../middlewares/authentification");

// Configuration de Multer pour le stockage en mémoire
const upload = multer({
  storage: multer.memoryStorage(), // Stocker les fichiers en mémoire
});

// POST /admin/podcasts
router.post("/podcasts", authentificationMiddleware, upload.single("thumbnail"), async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Aucun utilisateur n'est connecté." });
  }

  try {
    const { title, description, public, category_name } = req.body;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "Le fichier est requis." });
    }

    const thumbnail_path = await uploadToS3(req.file, "thumbnails");

    const category = await Category.findOne({ where: { name: category_name } });
    if (!category) {
      return res.status(404).json({ error: "La catégorie spécifiée n'existe pas." });
    }

    const podcast = await Podcast.create({
      title,
      description,
      thumbnail_path,
      public,
    });

    await podcast.addCategory(category);

    // Associer l'utilisateur au podcast créé
    await UserPodcast.create({
      UserId: req.user.id,
      PodcastId: podcast.id
    });

    res.json({ message: "Podcast créé avec succès et associé à l'utilisateur", podcast });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création du podcast." });
  }
});

router.patch("/podcasts/:id", authentificationMiddleware, upload.single("thumbnail"), async (req, res) => {
  try {
    const { title, description, public, category_name } = req.body;

    const podcast = await Podcast.findByPk(req.params.id);
    if (!podcast) {
      return res
        .status(404)
        .json({ error: "Le podcast spécifié n'existe pas." });
    }

    const isAuthorized = await podcast.hasUser(req.user);
    if (!isAuthorized) {
      return res.status(403).json({ error: "Vous n'êtes pas autorisé à modifier ce podcast." });
    }

    const newCategory = await Category.findOne({
      where: { name: category_name },
    });
    if (!newCategory) {
      return res
        .status(404)
        .json({ error: "La nouvelle catégorie spécifiée n'existe pas." });
    }

    // Récupérer les anciennes catégories liées au podcast
    const oldCategories = await podcast.getCategories();

    // Supprimer l'association avec les anciennes catégories
    await Promise.all(
      oldCategories.map(async (oldCategory) => {
        await podcast.removeCategory(oldCategory);
      })
    );

    // Ajouter l'association avec la nouvelle catégorie
    await podcast.addCategory(newCategory);

    let thumbnailPath = podcast.thumbnail_path; // Garder l'ancien chemin de la miniature par défaut

    // Vérifier s'il y a une nouvelle miniature à télécharger
    if (req.file) {
      // Envoyer le nouveau fichier de miniature vers S3
      thumbnailPath = await uploadToS3(req.file, "thumbnails");
    }

    // Mettre à jour les propriétés du podcast
    await podcast.update({
      title: title,
      description: description,
      thumbnail_path: thumbnailPath, // Utiliser le nouveau chemin de la miniature
      public: public,
    });

    res.json(podcast);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la modification du podcast." });
  }
});

// POST /admin/episodes
router.post("/episodes", upload.single("file"), async (req, res) => {
  try {
    const { title, description, release_date, duration, podcast_name } =
      req.body;

    // Vérifier si le podcast existe
    const podcast = await Podcast.findOne({ where: { title: podcast_name } });
    if (!podcast) {
      return res
        .status(404)
        .json({ error: "Le podcast spécifié n'existe pas." });
    }

    // Vérifier si le fichier a été correctement téléchargé
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "Le fichier est requis." });
    }

    // Vérifier si le fichier est au format MP3
    if (req.file.mimetype !== "audio/mpeg") {
      return res
        .status(400)
        .json({ error: "Le fichier doit être au format MP3." });
    }

    // Envoyer le fichier de l'épisode vers S3 dans le dossier "episodes"
    const file_path = await uploadToS3(req.file, "episodes");

    // Créer l'épisode
    const episode = await Episode.create({
      title,
      description,
      release_date,
      duration,
      file_path,
    });

    // Associer l'épisode au podcast
    await podcast.addEpisode(episode);

    res.json(episode);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création de l'épisode." });
  }
});

router.patch("/episodes/:id", upload.single("file"), async (req, res) => {
  try {
    const {
      title,
      description,
      release_date,
      duration,
      podcast_name,
    } = req.body;

    const episode = await Episode.findByPk(req.params.id);
    if (!episode) {
      return res
        .status(404)
        .json({ error: "L'épisode spécifié n'existe pas." });
    }

    let newPodcast;

    if (podcast_name) {
      newPodcast = await Podcast.findOne({
        where: { title: podcast_name },
      });
      
      if (!newPodcast) {
        return res
          .status(404)
          .json({ error: "Le nouveau podcast spécifié n'existe pas." });
      }
    }

    // Récupérer les anciens podcasts liés à l'épisode
    const oldPodcasts = await episode.getPodcasts();

    // Supprimer l'association avec les anciens podcasts
    await Promise.all(
      oldPodcasts.map(async (oldPodcast) => {
        await episode.removePodcast(oldPodcast);
      })
    );

    // Ajouter l'association avec le nouveau podcast si défini
    if (newPodcast) {
      await episode.addPodcast(newPodcast);
    }

    let filePath = episode.file_path; // Conserver l'ancien chemin du fichier par défaut

    // Vérifier s'il y a un nouveau fichier MP3 à télécharger
    if (req.file) {
      // Envoyer le nouveau fichier MP3 vers S3
      filePath = await uploadToS3(req.file, "episodes");
    }

    // Mettre à jour les propriétés de l'épisode
    await episode.update({
      title: title,
      description: description,
      release_date: release_date,
      duration: duration,
      file_path: filePath, // Utiliser le nouveau chemin du fichier MP3
    });

    res.json(episode);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la modification de l'épisode." });
  }
});



// Route pour ajouter une catégorie
router.post("/categories", async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({
      name: name,
      description: description,
    });

    res.json(category);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de la catégorie." });
  }
});

module.exports = router;
