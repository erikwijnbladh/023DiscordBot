// commands.js
const {
  fetchWorldRanks,
  fetchServerRanks,
} = require("./functions/fetchRankingsPerBoss");
const { displaySpeedruns } = require("./functions/fetchSpeedrun");

const config = require("./config");
const { serverSlug, serverRegion } = config;

// Function to format rankings into a table-like structure
const formatRankings = (title, rankings) => {
  const tableHeader = `\`\`\`
${title}:

| Boss                     | Rank       |
|--------------------------|------------|
`;

  const tableFooter = `\n\`\`\``;
  return tableHeader + rankings.join("\n") + tableFooter;
};

// Command handler function
const handleCommands = async (message) => {
  if (message.author.bot) return; // Ignore bot messages

  const args = message.content.split(" ");

  // Command for world rankings
  if (args[0] === "!worldrank") {
    const rankings = await fetchWorldRanks();
    message.channel.send(
      formatRankings("World Speed Rankings for NollTvåTre", rankings)
    );
  }

  // Command for server rankings
  if (args[0] === "!serverrank") {
    const serverRankings = await fetchServerRanks(serverRegion, serverSlug);
    message.channel.send(
      formatRankings(`Golemagg Speed Rankings for NollTvåTre`, serverRankings)
    );
  }

  // Command for speedrun rankings that fetches World, Region, and Server rankings
  if (args[0] === "!speedrun") {
    try {
      const speedrunRanks = await displaySpeedruns();
      message.channel.send(speedrunRanks);
    } catch (error) {
      console.error("Error fetching speedrun rankings:", error.message);
      message.channel.send(
        "There was an error fetching the speedrun rankings. Please try again later."
      );
    }
  }

  // Command for meme
  if (args[0] === "!rajco") {
    message.channel.send("wand when?");
  }

  // Command for help
  if (args[0] === "!023") {
    message.channel.send("!worldrank | !serverrank | !speedrun | !rajco");
  }
};

module.exports = handleCommands;
