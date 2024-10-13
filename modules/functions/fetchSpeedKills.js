const axios = require("axios");
const config = require("../config");

const { accessToken, guildId, size, serverSlug, serverRegion, encounters } =
  config;

const fetchSpeedKills = async (region, serverSlug) => {
  let results = [];

  for (const encounter of encounters) {
    const worldQuery = `{
        worldData {
          encounter(id: ${encounter.id}) {
            fightRankings(size: ${size}, metric: speed)
          }
        }
      }`;

    const regionQuery = `{
        worldData {
          encounter(id: ${encounter.id}) {
            fightRankings(size: ${size}, metric: speed, serverRegion: "${region}")
          }
        }
      }`;

    const serverQuery = `{
        worldData {
          encounter(id: ${encounter.id}) {
            fightRankings(size: ${size}, metric: speed, serverRegion: "${region}", serverSlug: "${serverSlug}")
          }
        }
      }`;

    try {
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

      // Check for guild ranking in each list
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

module.exports = { fetchSpeedKills };
