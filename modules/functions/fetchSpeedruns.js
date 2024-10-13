const axios = require("axios");
const config = require("../config");

const { accessToken, guildId, size, raids } = config; // Remove serverSlug and serverRegion from here

// Function to fetch rankings for world, region, and server
const fetchSpeedRunData = async (region, serverSlug) => {
  let results = [];

  for (const encounter of raids) {
    // Fetch World Rankings
    const worldQuery = `{
      worldData {
        encounter(id: ${encounter.id}) {
          fightRankings(size: ${size}, metric: speed)
        }
      }
    }`;

    // Fetch Region Rankings
    const regionQuery = `{
      worldData {
        encounter(id: ${encounter.id}) {
          fightRankings(size: ${size}, metric: speed, serverRegion: "${region}")
        }
      }
    }`;

    // Fetch Server Rankings
    const serverQuery = `{
      worldData {
        encounter(id: ${encounter.id}) {
          fightRankings(size: ${size}, metric: speed, serverRegion: "${region}", serverSlug: "${serverSlug}")
        }
      }
    }`;

    try {
      // Fetch all three rankings (world, region, server) concurrently
      const [worldResponse, regionResponse, serverResponse] = await Promise.all(
        [
          axios.post(
            "https://classic.warcraftlogs.com/api/v2/client",
            { query: worldQuery },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          ),
          axios.post(
            "https://classic.warcraftlogs.com/api/v2/client",
            { query: regionQuery },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          ),
          axios.post(
            "https://classic.warcraftlogs.com/api/v2/client",
            { query: serverQuery },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          ),
        ]
      );

      // Extract rankings from each response
      const worldRankings =
        worldResponse?.data?.data?.worldData?.encounter?.fightRankings
          ?.rankings || [];
      const regionRankings =
        regionResponse?.data?.data?.worldData?.encounter?.fightRankings
          ?.rankings || [];
      const serverRankings =
        serverResponse?.data?.data?.worldData?.encounter?.fightRankings
          ?.rankings || [];

      let worldRank = ">50";
      let regionRank = ">50";
      let serverRank = ">50";

      // Check for the guild's ranking in the world, region, and server results
      worldRankings.forEach((ranking, index) => {
        if (ranking.guild.id === guildId) {
          worldRank = index + 1;
        }
      });

      regionRankings.forEach((ranking, index) => {
        if (ranking.guild.id === guildId) {
          regionRank = index + 1;
        }
      });

      serverRankings.forEach((ranking, index) => {
        if (ranking.guild.id === guildId) {
          serverRank = index + 1;
        }
      });

      results.push({
        encounter: encounter.name,
        worldRank,
        regionRank,
        serverRank,
      });
    } catch (error) {
      console.error(
        `Error fetching rankings for ${encounter.name}:`,
        error.message
      );
      results.push({
        encounter: encounter.name,
        worldRank: "Error",
        regionRank: "Error",
        serverRank: "Error",
      });
    }
  }

  return results;
};

// Function to fetch and consolidate rankings for world, region, and server
const fetchSpeedRuns = async (region, serverSlug) => {
  // Fetch world, region, and server rankings using the provided parameters
  const worldRankings = await fetchSpeedRunData(); // World rankings don't need region or slug
  const regionRankings = await fetchSpeedRunData(region); // Pass region for region rankings
  const serverRankings = await fetchSpeedRunData(region, serverSlug); // Pass both region and serverSlug for server rankings

  // Consolidate the results into a single array
  const consolidatedResults = raids.map((_, i) => ({
    encounter: worldRankings[i].encounter,
    worldRank: worldRankings[i].worldRank,
    regionRank: regionRankings[i].regionRank,
    serverRank: serverRankings[i].serverRank,
  }));

  return consolidatedResults;
};

module.exports = { fetchSpeedRuns };
