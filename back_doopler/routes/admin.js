const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Episode, Podcast, PodcastEpisode } = require('../models/index');

router.post('/podcasts', async (req, res) => {
    try {
        const podcast = await Podcast.create(req.body);
        res.json(podcast);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/episodes', async (req, res) => {
    try {
        const { title, description, release_date, duration, file_path } = req.body;

        // Créer l'épisode
        const episode = await Episode.create({
            title,
            description,
            release_date,
            duration,
            file_path,
        });

        res.json(episode);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création de l\'épisode.' });
    }
});


module.exports = router;
