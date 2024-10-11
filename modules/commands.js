// commands.js
const { fetchWorldRanks, fetchServerRanks } = require("./fetchRankings");

const serverSlug = "golemagg"; // Your server slug
const serverName = "Golemagg"; // Your server slug
const serverRegion = "eu"; // Your server region

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
      formatRankings(
        `${serverName} Speed Rankings for NollTvåTre`,
        serverRankings
      )
    );
  }

  // Command for meme
  if (args[0] === "!rajco") {
    message.channel.send("wand when?");
  }

  // Command for help
  if (args[0] === "!023") {
    message.channel.send("!worldrank | !serverrank | !rajco");
  }
};

module.exports = handleCommands;
