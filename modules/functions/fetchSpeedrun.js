// fetchSpeedrun.js
const axios = require("axios");
const config = require("../config");

const { accessToken, guildId, size, serverSlug, serverRegion, raids } = config;

// Function to fetch guild rankings for specific encounters in a zone
const fetchSpeedrun = async (region, serverSlug) => {
  let results = [];

  for (const encounter of raids) {
    let query = `
    {
      worldData {
        encounter(id: ${encounter.id}) {
          fightRankings(size: ${size}, metric: speed`;

    if (region && serverSlug) {
      query += `, serverRegion: "${region}", serverSlug: "${serverSlug}"`;
    } else if (region) {
      query += `, serverRegion: "${region}"`;
    }
    query += `)
        }
      }
      guildData {
        guild(id: ${guildId}) {
          name
        }
      }
    }`;

    try {
      console.log(`Fetching rankings for encounter: ${encounter.name}`);

      const response = await axios.post(
        "https://classic.warcraftlogs.com/api/v2/client",
        { query },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const rankings =
        response?.data?.data?.worldData?.encounter?.fightRankings?.rankings;
      const guildName =
        response?.data?.data?.guildData?.guild?.name || "Unknown Guild";

      let rank = ">50";
      if (Array.isArray(rankings)) {
        rankings.forEach((ranking, index) => {
          if (ranking.guild.id === guildId) {
            rank = index + 1; // +1 because the index is 0-based
          }
        });
      }

      results.push({
        encounter: encounter.name,
        guildName,
        rank,
      });
    } catch (error) {
      console.error(
        `Error fetching rankings for ${encounter.name}:`,
        error.response?.data || error.message
      );
      results.push({
        encounter: encounter.name,
        guildName: "Unknown Guild",
        rank: "Error fetching data",
      });
    }
  }

  return results;
};

// Function to fetch and format world, region, and server rankings together
const displaySpeedruns = async () => {
  console.log("Fetching World Rankings...");
  const worldRankings = await fetchSpeedrun();

  console.log("\nFetching Region Rankings...");
  const regionRankings = await fetchSpeedrun(serverRegion);

  console.log("\nFetching Server Rankings...");
  const serverRankings = await fetchSpeedrun(serverRegion, serverSlug);

  // Get guild name from world rankings if available, otherwise default to "Unknown Guild"
  const guildName = worldRankings[0]?.guildName || "Unknown Guild";

  // Format consolidated rankings
  let formattedRankings = `Speedrun ranks for **${guildName}**\n\n`;

  raids.forEach((_, i) => {
    formattedRankings += `**${worldRankings[i].encounter}**\n`;
    formattedRankings += `World: ${worldRankings[i].rank} | Region: ${regionRankings[i].rank} | Server: ${serverRankings[i].rank}\n\n`;
  });

  return formattedRankings;
};

// Export the displaySpeedruns function
module.exports = { displaySpeedruns };
