// bot.js
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const handleCommands = require("./modules/commands");

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
