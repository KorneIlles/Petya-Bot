const {Events, InteractionType, Client} = require('discord.js');
const techStackModal = require('../modals/add-tech-stack-modal.js');
const logRoomId = process.env.LOG_ROOM_ID;
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {

            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            }
        }else if (interaction.type === InteractionType.ModalSubmit){
           if (interaction.customId === 'techStackModal'){
              await techStackModal.execute(interaction);
               interaction.member.client.channels.cache.get(logRoomId).send({content: interaction.fields.getTextInputValue("techStackInput").includes(',')?
                       `Log > Added these technologies: ***${interaction.fields.getTextInputValue("techStackInput")}*** to: <@${interaction.member.user.id}>!`
                       :`Log > Added this technology: ***${interaction.fields.getTextInputValue("techStackInput")}*** to: <@${interaction.member.user.id}>!`})
           }
        }
    }
};