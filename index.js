const path = require('node:path');
const {Client, Collection, Events, GatewayIntentBits} = require('discord.js');
const {commandsPath, commandFiles, eventsPath, eventFiles} = require('./common.js');
require('dotenv').config();
const token = process.env.TOKEN;

console.log("Starting")

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// Extends native Map class, used to store and efficiently retrieve commands for execution
client.commands = new Collection();

// Set the commands found in the 'commands' directory
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Register the event listeners found in the 'events' directory
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Has to be last line in the file
client.login(token);