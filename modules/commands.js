const { fetchSpeedKills } = require("./functions/fetchSpeedKills");
const { fetchSpeedRuns } = require("./functions/fetchSpeedruns");

const config = require("./config");
const { serverSlug, serverRegion } = config;

const formatSpeedTable = (columnLabel, rankings) => {
  const tableHeader = `\`\`\`
| ${columnLabel.padEnd(24)} | World | Region | Server |
|--------------------------|-------|--------|--------|
`;

  const tableFooter = `\n\`\`\``;
  const rows = rankings.map(
    (rank) =>
      `| ${rank.encounter.padEnd(24)} | ${rank.worldRank
        .toString()
        .padStart(5)} | ${rank.regionRank
        .toString()
        .padStart(6)} | ${rank.serverRank.toString().padStart(6)} |`
  );

  return tableHeader + rows.join("\n") + tableFooter;
};

// Handle commands sent in Discord
const handleCommands = async (message) => {
  if (message.author.bot) return;

  const args = message.content.split(" ");

  // Speedrun command
  if (args[0] === "!speedrun") {
    try {
      const speedrunRanks = await fetchSpeedRuns(serverRegion, serverSlug);
      message.channel.send(`Speedrun Rankings for **NollTvåTre**`);
      message.channel.send(formatSpeedTable("Raid", speedrunRanks));
    } catch (error) {
      console.error("Error fetching speedrun rankings:", error.message);
      message.channel.send(
        "There was an error fetching the speedrun rankings. Please try again later."
      );
    }
  }

  // Speedkills command
  if (args[0] === "!speedkills") {
    try {
      const speedKillsRanks = await fetchSpeedKills(serverRegion, serverSlug);
      message.channel.send(`Speed Kill Rankings for **NollTvåTre**`);
      message.channel.send(formatSpeedTable("Boss", speedKillsRanks));
    } catch (error) {
      console.error("Error fetching speedkill rankings:", error.message);
      message.channel.send(
        "There was an error fetching the speedkill rankings. Please try again later."
      );
    }
  }

  // Command for meme
  if (args[0] === "!rajco") {
    message.channel.send("wand when?");
  }

  // Command for help
  if (args[0] === "!023") {
    message.channel.send("!speedkills | !speedrun | !rajco");
  }
};

module.exports = handleCommands;
