const sequelize = require('./_database');

const Podcast = require('./podcast');
const Episode = require('./episode');
const PodcastEpisode = require('./PodcastEpisode');


Podcast.hasMany(Episode);
Episode.belongsTo(Podcast);

Podcast.belongsToMany(Episode, { through: PodcastEpisode });
Episode.belongsToMany(Podcast, { through: PodcastEpisode });

// Synchronisation de la base
sequelize.sync();

module.exports = {
    Podcast: Podcast,
    Episode: Episode,
    PodcastEpisode: PodcastEpisode
};