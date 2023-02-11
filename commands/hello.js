const {SlashCommandBuilder} = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Greets the user with random niceties.')
        //This is an example for a subcommand with user target
        .addSubcommand(subcommand =>
            subcommand
                .setName('parameter1')
                .setDescription('This is the first parameter')
                .addUserOption(option => 
                    option
                    .setName('target')
                    .setDescription('The user')
                    .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('parameter2')
                .setDescription('This is the second parameter')),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === "parameter1"){
            const user = interaction.options.getUser('target');
            await interaction.reply(
                `This is a test command to say hello to ${user}!`
            );
        }else if(interaction.options.getSubcommand() === "parameter2"){
            await interaction.reply(
                `This is a test command to say hello!`
            );
        }else{
            await interaction.reply(
                `This is not supposed to happen, but good job (someone)!`
            );
        }
        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild
        
    },
};