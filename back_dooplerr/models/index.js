const sequelize = require("./_database");
const Podcast = require("./Podcast");
const Episode = require("./Episode");
const PodcastEpisode = require("./PodcastEpisode");
const Comment = require("./Comment");
const EpisodeComment = require("./EpisodeComment");
const Category = require("./Category");
const PodcastCategory = require("./PodcastCategory");
const User = require("./User");
const UserPodcast = require("./UserPodcast");
const UserComment = require("./UserComment");
const UserHistory = require("./UserHistory");

// Relation entre Podcast et Episode via PodcastEpisode
Podcast.belongsToMany(Episode, { through: PodcastEpisode });
Episode.belongsToMany(Podcast, { through: PodcastEpisode });

// Relation entre Episode et Comment via EpisodeComment
Episode.belongsToMany(Comment, { through: EpisodeComment });
Comment.belongsToMany(Episode, { through: EpisodeComment });

// Relation entre Podcast et Category via PodcastCategory
Podcast.belongsToMany(Category, { through: PodcastCategory });
Category.belongsToMany(Podcast, { through: PodcastCategory });

// Relation entre User et Podcast via UserPodcast
User.belongsToMany(Podcast, { through: UserPodcast });
Podcast.belongsToMany(User, { through: UserPodcast });

// Relation entre User et Comment via UserComment
User.belongsToMany(Comment, { through: UserComment });
Comment.belongsToMany(User, { through: UserComment });

// Relation entre User et Episode via UserHistory
User.belongsToMany(Episode, { through: UserHistory });
Episode.belongsToMany(User, { through: UserHistory });


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
  UserHistory: UserHistory,
};
