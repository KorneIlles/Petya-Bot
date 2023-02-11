const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('This is a test with other parameter')
        .addStringOption(option =>
            option
                .setName('manage')
                .setDescription('add, remove, or view a note!')
                .setRequired(true)
                .addChoices(
                    {name: 'add', value: "add"},
                    {name: "remove", value: "remove"},
                    {name: "view", value: "view"}
                ))
        .addUserOption(option =>
            option
                .setName('student')
                .setDescription('choose a student as a target of this command!')
                .setRequired(true)),
    async execute(interaction) {
        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild
        await interaction.reply(
            `This is test command to test Options in commands`
        );
    },
};