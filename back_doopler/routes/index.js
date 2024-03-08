let express = require('express');
let router = express.Router();

const { Op } = require('sequelize');
const { Episode, Podcast, PodcastEpisode } = require('../models/index');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("/!\\ DOOPLERR /!\\");
});


router.get('/podcasts', async (req, res) => {
  const podcasts = await Podcast.findAll({
      include: Episode
  });
  res.json(podcasts);
});

router.get('/podcasts/:id', async (req, res) => {
  const podcast = await Podcast.findByPk(req.params.id, {
      include: Episode
  });
  res.json(podcast);
});

router.get('/episodes', async (req, res) => {
  const episodes = await Episode.findAll({
      include: Podcast
  });
  res.json(episodes);
});

router.get('/episodes/:id', async (req, res) => {
  const episode = await Episode.findByPk(req.params.id, {
      include: Podcast
  });
  res.json(episode);
});

module.exports = router;
