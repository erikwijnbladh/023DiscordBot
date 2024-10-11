const axios = require("axios");
const fs = require("fs"); // To write to a file
require("dotenv").config(); // To load environment variables from a .env file

// Your access token from the .env file
const accessToken = process.env.ACCESS_TOKEN;

// Use the Access Token to Query the API Schema
async function fetchApiSchema() {
  try {
    const schemaResponse = await axios.post(
      "https://classic.warcraftlogs.com/api/v2/client",
      {
        query: `
          {
            __schema {
              types {
                name
                kind
                fields {
                  name
                  description
                  args {
                    name
                    description
                    type {
                      name
                      kind
                      ofType {
                        name
                        kind
                      }
                    }
                  }
                  type {
                    name
                    kind
                    ofType {
                      name
                      kind
                    }
                  }
                }
              }
            }
          }
        `,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Save the API schema to a file
    fs.writeFileSync(
      "apiSchema.json",
      JSON.stringify(schemaResponse.data, null, 2)
    );
    console.log("Schema saved to apiSchema.json");
  } catch (error) {
    console.error(
      "Error fetching API schema:",
      error.response ? error.response.data : error.message
    );
  }
}

// Run the function
fetchApiSchema();
