// models/index.js
const sequelize = require('./_database');

const Podcast = require('./podcast');
const Episode = require('./Episode');
const PodcastEpisode = require('./PodcastEpisode');
const Comment = require('./Comment');
const EpisodeComment = require('./EpisodeComment');
const Category = require('./Category');
const PodcastCategory = require('./PodcastCategory');

const User = require('./User');
const UserPodcast = require('./UserPodcast');
const UserComment = require('./UserComment');
const UserHistory = require('./UserHistory');

// Configurez les associations
Podcast.belongsToMany(Episode, { through: PodcastEpisode });
Episode.belongsToMany(Podcast, { through: PodcastEpisode });

// Utilisez belongsToMany pour associer plusieurs commentaires à un épisode
Episode.belongsToMany(Comment, { through: EpisodeComment });
Comment.belongsToMany(Episode, { through: EpisodeComment });

// Utilisez belongsToMany pour associer plusieurs catégories à un podcast
Podcast.belongsToMany(Category, { through: PodcastCategory });
Category.belongsToMany(Podcast, { through: PodcastCategory });

// Utilisez belongsToMany pour associer plusieurs podcasts à un utilisateur
User.belongsToMany(Podcast, { through: UserPodcast });
Podcast.belongsToMany(User, { through: UserPodcast });

// Utilisez belongsToMany pour associer plusieurs commentaires à un utilisateur
User.belongsToMany(Comment, { through: UserComment });
Comment.belongsToMany(User, { through: UserComment });

// Utilisez belongsToMany pour associer plusieurs épisodes à un utilisateur
User.belongsToMany(Episode, { through: UserHistory });
Episode.belongsToMany(User, { through: UserHistory });

// // Synchronisation de la base
sequelize.sync();

module.exports = {
    Podcast: Podcast,
    Episode: Episode,
    Comment: Comment,
    PodcastEpisode: PodcastEpisode,
    EpisodeComment: EpisodeComment,
    Category: Category,
    PodcastCategory: PodcastCategory,
    User: User,
    UserPodcast: UserPodcast,
    UserComment: UserComment,
    UserHistory: UserHistory
};
