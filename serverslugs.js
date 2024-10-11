const axios = require("axios");
require("dotenv").config();
const accessToken = process.env.ACCESS_TOKEN;

const fetchServerSlugs = async () => {
  const query = `
    {
      worldData {
        regions {
          name
          servers {
            data {
              name
              slug
            }
          }
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

    // Log the entire response to understand its structure
    console.log("Full Response:", JSON.stringify(response.data, null, 2));

    // Now, safely access the expected fields
    if (response.data && response.data.data && response.data.data.worldData) {
      const regions = response.data.data.worldData.regions;
      regions.forEach((region) => {
        console.log(`Region: ${region.name}`);
        region.servers.data.forEach((server) => {
          console.log(`Server Name: ${server.name}, Slug: ${server.slug}`);
        });
      });
    } else {
      console.error("Unexpected response structure.");
    }
  } catch (error) {
    console.error("Error fetching server slugs:", error);
  }
};

// Call the function to get server slugs
fetchServerSlugs();
