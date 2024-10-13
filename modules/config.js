// config.js
require("dotenv").config();

module.exports = {
  accessToken: process.env.ACCESS_TOKEN,
  guildId: 703640, // The guild ID of NollTvåTre
  size: 10, // 10-man raid size
  serverSlug: "golemagg", // Your server slug
  serverRegion: "eu", // Your server region
  raids: require("./raids"), // Import the raids list
  encounters: require("./encounters"), // Import the encounters list
};
