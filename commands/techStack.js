const {
    SlashCommandBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');

const queries = require('../database/database-queries.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`tech-stack`)
        .setDescription(`There will be appear a modal window where you can add your techs to your techStack.`)
        .addStringOption(option =>
            option
                .setName('option')
                .setDescription('Choose show, add, delete or reset your tech stack!')
                .setRequired(true)
                .addChoices(
                    {name: 'show', value: "show"},
                    {name: "add", value: "add"},
                    {name: "delete", value: "delete"},
                    {name: "reset", value: "reset"}
                )),
    async execute(interaction) {
        const option = interaction.options.getString('option');
        const userInfo = interaction.member.user
        if (option === "add") {
            const modal = new ModalBuilder()
                .setCustomId(`techStackModal`)
                .setTitle(`${userInfo.username}'s tech stack`);

            const textInput = new TextInputBuilder()
                .setCustomId(`techStackInput`)
                .setLabel(`add technologies like: java,c# (use commas)`)
                .setRequired(false)
                .setStyle(TextInputStyle.Paragraph);

            modal.addComponents(
                new ActionRowBuilder()
                    .addComponents(textInput)
            );

            await interaction.showModal(modal);
        } else if (option == "show") {
            console.log("show")
            let technologiesFinalForm = "";
           await queries.getTechnologies(userInfo.id)
                .then(technologies => {
                    let technologiesString = "";
                    technologies.forEach(value => {
                        technologiesString = `${technologiesString}, ${value.technology}`
                    })
                    technologiesFinalForm = technologiesString.substring(1);
                    console.log(`technologies after the forEach  ${technologiesFinalForm}`)
                }).catch(error => {
                console.error(error);
            }).finally(
                console.log("hello in the finally block"))
            interaction.reply({
                content: `this is your current tech stack: ***${technologiesFinalForm}***`,
                ephemeral: true
            });
        } else if (option === "delete") {
            console.log("delete");
        } else if (option === "reset") {
            console.log("reset");
        }
    }
}