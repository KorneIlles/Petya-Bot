const queries = require('../database/database-queries.js');
const utils = require('../utils/utils.js')

module.exports = {
    data: {
        name: `test text`
    },
    async execute(interaction) {
        const addedTechs = [];
        const userId = interaction.member.user.id
        const inputTechnologies = interaction.fields.getTextInputValue("techStackInput");
        const technologies = inputTechnologies.split(",")

        for (const tech of technologies) {
            if (tech.match(/^[A-Za-z0-9#]*$/) && tech.length >0) {
                console.log(tech);
                const capitalizedTech = utils.capitalizeFirstLetter(tech.trim());
                await queries.checkIfTechnologyAlreadyAdded(userId, capitalizedTech)
                    .then(techExist => {
                        if (!techExist) {
                            queries.addTechToUserTechStack(userId, capitalizedTech);

                            addedTechs.push(capitalizedTech);
                            console.log(addedTechs)
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        }

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

