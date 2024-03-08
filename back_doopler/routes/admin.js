const express = require('express');
const router = express.Router();
const { Episode, Podcast } = require('../models/index');

// POST /admin/podcasts
router.post('/podcasts', async (req, res) => {
    try {
        const { title, description, thumbnail_path, public } = req.body;

        const podcast = await Podcast.create({
            title,
            description,
            thumbnail_path,
            public,
        });

        res.json(podcast);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création du podcast.' });
    }
});

// POST /admin/episodes
router.post('/episodes', async (req, res) => {
    try {
        const { title, description, release_date, duration, file_path, podcast_name } = req.body;

        // Log req.body just for debugging
        console.log(req.body);

        const podcast = await Podcast.findOne({ where: { title: podcast_name } }); // Change 'title' to 'podcast_name'
        if (!podcast) {
            return res.status(404).json({ error: 'Le podcast spécifié n\'existe pas.' });
        }

        const episode = await Episode.create({
            title,
            description,
            release_date,
            duration,
            file_path,
        });

        await podcast.addEpisode(episode);

        res.json(episode);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création de l\'épisode.' });
    }
});

router.patch('/episodes/:id', async (req, res) => {
    try {
        const { title, description, release_date, duration, file_path, podcast_name } = req.body;

        const episode = await Episode.findByPk(req.params.id);
        if (!episode) {
            return res.status(404).json({ error: 'L\'épisode spécifié n\'existe pas.' });
        }

        const newPodcast = await Podcast.findOne({ where: { title: podcast_name } });
        if (!newPodcast) {
            return res.status(404).json({ error: 'Le nouveau podcast spécifié n\'existe pas.' });
        }

        // Récupérer les anciens podcasts liés à l'épisode
        const oldPodcasts = await episode.getPodcasts();

        // Supprimer l'association avec les anciens podcasts
        await Promise.all(oldPodcasts.map(async (oldPodcast) => {
            await episode.removePodcast(oldPodcast);
        }));

        // Ajouter l'association avec le nouveau podcast
        await episode.addPodcast(newPodcast);

        // Mettre à jour les propriétés de l'épisode
        await episode.update({
            title: title,
            description: description,
            release_date: release_date,
            duration: duration,
            file_path: file_path
        });

        res.json(episode);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la modification de l\'épisode.' });
    }
});




module.exports = router;
