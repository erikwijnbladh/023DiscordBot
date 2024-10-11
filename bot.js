const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const handleCommands = require("./modules/commands");
const express = require("express");

// Discord client setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log("Bot is ready!");
});

// Use the command handler from commands.js
client.on("messageCreate", handleCommands);

// Login to Discord
client.login(process.env.DISCORD_BOT_TOKEN);

// Express server to keep the Replit project alive
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(PORT, () => {
  console.log(`Web server is running on port ${PORT}`);
});
