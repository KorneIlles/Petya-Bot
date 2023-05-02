const {
    SlashCommandBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');

const queries = require('../database/database-queries.js');
const utils = require("../utility/StringManipulator");


async function manipulateTechnologies(userInfo) {
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
    return technologiesFinalForm;
}

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
                let technologiesFinalForm = await manipulateTechnologies(userInfo);
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
                                        const member = interaction.member;

                                        // Get the role to remove
                                        const roleToRemove = member.roles.cache.find(role => role.name === capitalizedTech);

                                        if (roleToRemove) {
                                            // Remove the role
                                            member.roles.remove(roleToRemove)
                                                .then(() => {
                                                    console.log(`Removed role "${roleToRemove.name}" from user "${member.user.tag}"`);
                                                    // Send a confirmation message to the user
                                                    interaction.reply({
                                                        content:`Removed role "${roleToRemove.name}" from you.`,
                                                        ephemeral: true
                                                    });
                                                })
                                                .catch(console.error);
                                        }
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
                let getAllTechnologies = await manipulateTechnologies(userInfo);
                const member = interaction.member;
                const rolesToRemoveIds = member.roles.cache.filter(role => getAllTechnologies.includes(role.name)).map(role => role.id);

                member.roles.remove(rolesToRemoveIds)
                    .then(() => console.log(`Removed roles ${getAllTechnologies} from user ${member.user.tag}`))
                    .catch(console.error);
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
