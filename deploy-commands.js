const {REST, Routes} = require('discord.js');
const {commandFiles} = require('./common.js');
require('dotenv').config();
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

const commands = [];

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({version: '10'}).setToken(token);

// Deploy commands
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands globally with the current set
        const data = await rest.put(
            Routes.applicationCommands(clientId),
            {body: commands},
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();