const queries = require('../database/database-queries.js');
const utils = require('../utility/StringManipulator.js')

function createRoles(interaction, addedTechs) {
    console.log(addedTechs);
    const guild = interaction.guild
    for (let i = 0; i < addedTechs.length; i++) {
        const techName = addedTechs[i];
        const role = guild.roles.cache.find(role => role.name === techName);
        if (role) {
            // If role already exists, assign it to the user
            const member = interaction.member;
            member.roles.add(role)
                .then(console.log(`Assigned role "${role.name}" to user "${member.user.tag}"`))
                .catch(console.error);
        } else {
            // Create a new role with the name of the technology
            guild.roles.create({
                name: techName,
                color: utils.randomColorHexCodeGenerator(),
            })
                .then((role) => {
                    console.log(`Created role "${role.name}"`);
                    // Assign the role to the user who started the interaction
                    const member = interaction.member;
                    member.roles.add(role)
                        .then(console.log(`Assigned role "${role.name}" to user "${member.user.tag}"`))
                        .catch(console.error);
                })
                .catch(console.error);
        }
    }
}

module.exports = {
    data: {
        name: `add-tech-stack-modal`
    },
    async execute(interaction) {
        const addedTechs = [];
        const userId = interaction.member.user.id
        const inputTechnologies = interaction.fields.getTextInputValue("techStackInput");
        const technologies = inputTechnologies.replaceAll(" ", "").split(",")

        for (const tech of technologies) {
            if (tech.match(/^[A-Za-z0-9#]*$/) && tech.length >0) {
                const capitalizedTech = utils.capitalizeTheString(tech.trim());
                await queries.checkIfTechnologyInTheDatabase(userId, capitalizedTech)
                    .then(techExist => {
                        if (!techExist) {
                            queries.addTechToUserTechStack(userId, capitalizedTech);

                            addedTechs.push(capitalizedTech);
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        }

        createRoles(interaction, addedTechs)

        if (addedTechs.length > 0) {
            await interaction.reply({
                content: addedTechs.includes(',') ?
                    `You added to your tech stack these technologies: ***${addedTechs}***`
                    : `You added to your tech stack this technology: ***${addedTechs}***`,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: `You didn't add any new technology to your stack.`,
                ephemeral: true
            })
        }
    }
}

