const {
    SlashCommandBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const queries = require('../database/database-queries.js');
const utils = require("../utils/utils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tech-stack")
        .setDescription("this command can manage your tech stack.")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add")
                .setDescription("this command use to add new tech to your tech stack.")
        ).addSubcommand((subcommand) =>
            subcommand
                .setName("show")
                .setDescription("this command use to show your tech stack.")
        ).addSubcommand((subcommand) =>
            subcommand
                .setName("delete")
                .setDescription("this command use to delete a technology in your tech stack.")
                .addStringOption(option =>
                    option
                        .setName('technology')
                        .setDescription('write a technology what you want to delete')
                        .setRequired(true)
                )
        ).addSubcommand((subcommand) =>
            subcommand
                .setName("reset")
                .setDescription("this command reset your whole tech stack")
        ),
    async execute(interaction) {
        console.log(interaction.options._subcommand);
        const option = interaction.options._subcommand;
        const userInfo = interaction.member.user

        switch (option) {
            case 'add':
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
                break;
            case 'show':
                let technologiesFinalForm = "";
                await queries.getTechnologies(userInfo.id)
                    .then(technologies => {
                        let technologiesString = "";
                        technologies.forEach(value => {
                            technologiesString = `${technologiesString}, ${value.technology}`
                        })
                        technologiesFinalForm = technologiesString.substring(1);
                    }).catch(error => {
                        console.error(error);
                    })
                interaction.reply({
                    content: technologiesFinalForm.length > 0 ?
                        `this is your current tech stack: ***${technologiesFinalForm}***`:
                        `your tech stack is empty`,
                    ephemeral: true
                });
                break;
            case 'delete':
                const technology = interaction.options.getString('technology');
                if (technology.match(/^[A-Za-z0-9#]*$/) && technology.length > 0) {
                    const capitalizedTech = utils.capitalizeTheString(technology.trim());
                    await queries.checkIfTechnologyInTheDatabase(userInfo.id, capitalizedTech)
                        .then(techExist => {
                            if (techExist) {
                                queries.deleteTechnology(userInfo.id, capitalizedTech, (error) => {
                                    if (error) {
                                        console.error(error);
                                        interaction.reply({
                                            content: `An error occurred during deletion process.`,
                                            ephemeral: true
                                        })
                                    } else {
                                        interaction.reply({
                                            content: `deleted this technology from your tech stack: ***${capitalizedTech}***`,
                                            ephemeral: true
                                        })
                                    }
                                });
                            } else {
                                interaction.reply({
                                    content: `this technology: ***${capitalizedTech}*** doesn't exist in your tech stack.`,
                                    ephemeral: true
                                })

                            }
                        })
                        .catch(error => {
                            console.error(error);
                        });
                } else {
                    interaction.reply({
                        content: `this technology: ***${technology}*** can't be in your tech stack`,
                        ephemeral: true
                    })
                }
                break;
            case 'reset':
                console.log("this is the reset case");
                queries.resetTechStack(userInfo.id, (error) => {
                    if (error) {
                        console.error(error);
                        interaction.reply({
                            content: `An error occurred during deletion process.`,
                            ephemeral: true
                        })
                    }
                });
                interaction.reply({
                    content: `your tech stack is cleared.`,
                    ephemeral: true
                })
                break;
        }
    }
}


// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName(`tech-stack`)
//         .setDescription(`There will be appear a modal window where you can add your techs to your techStack.`)
//         .addStringOption(option =>
//             option
//                 .setName('option')
//                 .setDescription('Choose show, add, delete or reset your tech stack!')
//                 .setRequired(true)
//                 .addChoices(
//                     {name: 'show', value: "show"},
//                     {name: "add", value: "add"},
//                     {name: "delete", value: "delete"},
//                     {name: "reset", value: "reset"}
//                 )
//         ).addStringOption(option =>
//             option
//                 .setName('need-for-delete')
//                 .setDescription('this need for delete command')
//         ),
//     async execute(interaction) {
//         const option = interaction.options.getString('option');
//         const userInfo = interaction.member.user
//         if (option === "add") {
//             const modal = new ModalBuilder()
//                 .setCustomId(`techStackModal`)
//                 .setTitle(`${userInfo.username}'s tech stack`);
//
//             const textInput = new TextInputBuilder()
//                 .setCustomId(`techStackInput`)
//                 .setLabel(`add technologies like: java,c# (use commas)`)
//                 .setRequired(false)
//                 .setStyle(TextInputStyle.Paragraph);
//
//             modal.addComponents(
//                 new ActionRowBuilder()
//                     .addComponents(textInput)
//             );
//
//             await interaction.showModal(modal);
//         } else if (option == "show") {
//             console.log("show")
//             let technologiesFinalForm = "";
//             await queries.getTechnologies(userInfo.id)
//                 .then(technologies => {
//                     let technologiesString = "";
//                     technologies.forEach(value => {
//                         technologiesString = `${technologiesString}, ${value.technology}`
//                     })
//                     technologiesFinalForm = technologiesString.substring(1);
//                     console.log(`technologies after the forEach  ${technologiesFinalForm}`)
//                 }).catch(error => {
//                     console.error(error);
//                 }).finally(
//                     console.log("hello in the finally block"))
//             interaction.reply({
//                 content: `this is your current tech stack: ***${technologiesFinalForm}***`,
//                 ephemeral: true
//             });
//         } else if (option === "delete") {
//             console.log("delete")
//             const technology = interaction.options.getString('need-for-delete');
//
//         } else if (option === "reset") {
//             console.log("reset");
//         }
//     }
// }


//
// async execute(interaction) {
//     const option = interaction.options.getString('option');
//     const userInfo = interaction.member.user
//     if (option === "add") {
//         const modal = new ModalBuilder()
//             .setCustomId(`techStackModal`)
//             .setTitle(`${userInfo.username}'s tech stack`);
//
//         const textInput = new TextInputBuilder()
//             .setCustomId(`techStackInput`)
//             .setLabel(`add technologies like: java,c# (use commas)`)
//             .setRequired(false)
//             .setStyle(TextInputStyle.Paragraph);
//
//         modal.addComponents(
//             new ActionRowBuilder()
//                 .addComponents(textInput)
//         );
//
//         await interaction.showModal(modal);
//     } else if (option == "show") {
//         console.log("show")
//         let technologiesFinalForm = "";
//         await queries.getTechnologies(userInfo.id)
//             .then(technologies => {
//                 let technologiesString = "";
//                 technologies.forEach(value => {
//                     technologiesString = `${technologiesString}, ${value.technology}`
//                 })
//                 technologiesFinalForm = technologiesString.substring(1);
//                 console.log(`technologies after the forEach  ${technologiesFinalForm}`)
//             }).catch(error => {
//                 console.error(error);
//             }).finally(
//                 console.log("hello in the finally block"))
//         interaction.reply({
//             content: `this is your current tech stack: ***${technologiesFinalForm}***`,
//             ephemeral: true
//         });
//     } else if (option === "delete") {
//         console.log("delete")
//         const technology = interaction.options.getString('need-for-delete');
//
//     } else if (option === "reset") {
//         console.log("reset");
//     }
// }