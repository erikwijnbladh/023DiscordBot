const { fetchSpeedKills } = require("./functions/fetchSpeedKills");
const { fetchSpeedRuns } = require("./functions/fetchSpeedruns");
const axios = require("axios");

const config = require("./config");
const { serverSlug, serverRegion } = config;

const formatSpeedTable = (columnLabel, rankings) => {
  const tableHeader = `\`\`\`
| ${columnLabel.padEnd(18)} | World | Region | Server |
|--------------------|-------|--------|--------|
`;

  const tableFooter = `\n\`\`\``;
  const rows = rankings.map(
    (rank) =>
      `| ${rank.encounter.padEnd(18)} | ${rank.worldRank
        .toString()
        .padStart(5)} | ${rank.regionRank
        .toString()
        .padStart(6)} | ${rank.serverRank.toString().padStart(6)} |`
  );

  return tableHeader + rows.join("\n") + tableFooter;
};

// Command handler function
const handleCommands = async (message) => {
  if (message.author.bot) return;

  const args = message.content.split(" ");

  // Speedrun command
  if (args[0] === "!speedrun") {
    try {
      // Send "Loading..." message first
      const loadingMessage = await message.channel.send("Loading Speedruns...");

      const speedrunRanks = await fetchSpeedRuns(serverRegion, serverSlug);

      // Edit the message once data is loaded
      await loadingMessage.delete(`Speedrun Rankings for **NollTvåTre**`);
      await message.channel.send(formatSpeedTable("Raid", speedrunRanks));
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
      // Send "Loading..." message first
      const loadingMessage = await message.channel.send(
        "Loading Speedkills..."
      );

      const speedKillsRanks = await fetchSpeedKills(serverRegion, serverSlug);

      // Edit the message once data is loaded
      await loadingMessage.delete(`Speed Kill Rankings for **NollTvåTre**`);
      await message.channel.send(formatSpeedTable("Boss", speedKillsRanks));
    } catch (error) {
      console.error("Error fetching speedkill rankings:", error.message);
      message.channel.send(
        "There was an error fetching the speedkill rankings. Please try again later."
      );
    }
  }

  // Command for meme
  if (args[0] === "!rajco") {
    message.channel.send("Wand when?");
  }

  // Command for wand price
  if (args[0] === "!wand") {
    try {
      const apiUrl =
        "https://jpworgen.com/grafana/api/datasources/proxy/1/?query=WITH%20(%0A%20%20%20%20SELECT%20UpdateTime%0A%20%20%20%20FROM%20jpworgen.LatestUpdates%0A%20%20%20%20WHERE%20HouseName%20%3D%20%27Golemagg%20-%20Horde%27%0A%20%20%20%20ORDER%20BY%20UpdateTime%20DESC%0A%20%20%20%20LIMIT%201%0A)%20AS%20LatestUpdate%0ASELECT%0A%20%20sum(Quantity)%20AS%20Quantity%2C%0A%20%20floor(divide(ai.Buyout%2C%20ai.Quantity))%20AS%20BuyoutPer%2C%0A%20%20GoldNum(floor(divide(ai.Buyout%2C%20ai.Quantity)))%20as%20%22Buyout%20Per%22%0AFROM%20jpworgen.ActiveItems%20AS%20ai%0AANY%20LEFT%20JOIN%20jpworgen.ItemInfo%20AS%20ii%20ON%20ii.ItemId%20%3D%20ai.ItemId%0AANY%20LEFT%20JOIN%20jpworgen.AuctHouses%20AS%20a%20ON%20a.Id%20%3D%20ai.RealmId%20AND%20a.Faction%20%3D%20ai.Faction%0AWHERE%20ii.Name%20%3D%20%27Theresa%5C%27s%20Booklight%27%20AND%20(a.HouseName%20%3D%20%27Golemagg%20-%20Horde%27)%20AND%20UpdateTime%20%3D%20LatestUpdate%20AND%20ai.Buyout%20!%3D%200%0AGROUP%20BY%20BuyoutPer%0AORDER%20BY%20BuyoutPer%20FORMAT%20JSON";

      const response = await axios.get(apiUrl);

      // Extract the "Lowest Buyout" and round it to the nearest whole number
      const lowestBuyout = Math.round(response.data.data[0]["Buyout Per"]);
      await message.channel.send(
        `Latest available lowest price for Theresa's Booklight on Golemagg - Horde: ${lowestBuyout} gold.`
      );
    } catch (error) {
      message.channel.send(
        "There was an error fetching wand price. Please try again later."
      );
    }
  }

  // Command for help
  if (args[0] === "!023") {
    message.channel.send("!speedkills | !speedrun | !rajco | !wand");
  }
};

module.exports = handleCommands;
