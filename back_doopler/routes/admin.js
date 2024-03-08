const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Episode, Podcast, PodcastEpisode } = require('../models/index');

router.post('/podcasts', async (req, res) => {
    const podcast = await Podcast.create(req.body);
    res.json(podcast);
});

router.post('/episodes', async (req, res) => {
    const episode = await Episode.create(req.body);
    res.json(episode);
});