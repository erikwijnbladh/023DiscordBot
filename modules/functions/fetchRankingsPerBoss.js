// fetchRankingsPerBoss.js
const axios = require("axios");
const config = require("../config");

const { accessToken, guildId, size, serverSlug, serverRegion, encounters } =
  config;

// Generic function to fetch rankings
const fetchRankings = async (serverRegion, serverSlug) => {
  let results = [];
  for (const encounter of encounters) {
    let query = `
    {
      worldData {
        encounter(id: ${encounter.id}) {
          fightRankings(size: ${size}, metric: speed`;

    if (serverRegion && serverSlug) {
      query += `, serverRegion: "${serverRegion}", serverSlug: "${serverSlug}"`;
    }
    query += `)
        }
      }
    }`;

    try {
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

      if (Array.isArray(rankings)) {
        // Find the rank of the guild with ID 703640
        let rank = null;
        rankings.forEach((ranking, index) => {
          if (ranking.guild.id === guildId) {
            rank = index + 1; // +1 because the index is 0-based
          }
        });

        if (rank) {
          results.push(
            `| ${encounter.name.padEnd(24)} | ${rank.toString().padStart(10)} |`
          );
        } else {
          const above50 = ">50";
          // If guild not in the top rankings, default rank to ">50"
          results.push(
            `| ${encounter.name.padEnd(24)} | ${above50.padStart(10)} |`
          );
        }
      } else {
        results.push(`| ${encounter.name.padEnd(24)} | Error fetching data |`);
      }
    } catch (error) {
      console.error(
        `Error fetching speed rankings for ${encounter.name}:`,
        error.message
      );
      results.push(`| ${encounter.name.padEnd(24)} | Error fetching data |`);
    }
  }
  return results;
};

// Fetch all world rankings
const fetchWorldRanks = async () => {
  return await fetchRankings(null, null);
};

// Fetch all rankings for a specific server
const fetchServerRanks = async (serverRegion, serverSlug) => {
  return await fetchRankings(serverRegion, serverSlug);
};

module.exports = { fetchWorldRanks, fetchServerRanks };
