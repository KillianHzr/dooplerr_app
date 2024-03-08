// models/index.js
const sequelize = require('./_database');

const Podcast = require('./podcast');
const Episode = require('./episode');
const PodcastEpisode = require('./PodcastEpisode');
const Comment = require('./Comment');
const EpisodeComment = require('./EpisodeComment');
const Category = require('./Category');
const PodcastCategory = require('./PodcastCategory');

// Configurez les associations
Podcast.belongsToMany(Episode, { through: PodcastEpisode });
Episode.belongsToMany(Podcast, { through: PodcastEpisode });

// Utilisez belongsToMany pour associer plusieurs commentaires à un épisode
Episode.belongsToMany(Comment, { through: EpisodeComment });
Comment.belongsToMany(Episode, { through: EpisodeComment });

// Utilisez belongsToMany pour associer plusieurs catégories à un podcast
Podcast.belongsToMany(Category, { through: PodcastCategory });
Category.belongsToMany(Podcast, { through: PodcastCategory });

// // Synchronisation de la base
sequelize.sync();

module.exports = {
    Podcast: Podcast,
    Episode: Episode,
    Comment: Comment,
    PodcastEpisode: PodcastEpisode,
    EpisodeComment: EpisodeComment,
};
