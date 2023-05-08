const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const queries = require('../database/database-queries.js');

async function storeMissingUserIds(interaction) {
    const guildMembers = await interaction.guild.members.fetch(); // Fetches all members in the guild

    for (const [id, member] of guildMembers) {
        // Check if user ID is already present in the database
        const idExists = await queries.checkIfIdExists(id);

        if (!idExists) {
            // If ID is not present in the database, store it
            await queries.addUserToDatabase(id, member.user.username);
        }
    }
}

async function storeMissingUserRoles(interaction){
    const guild = interaction.guild;
    await queries.getAllUserId()
        .then(async userIds => {
            const noAddableRole = ["@everyone", "admin", "student", "Week A", "Week B","Admin"]
            for (const userId of userIds) {
                const id = userId.id;
                const member = await guild.members.fetch(id);
                const roles = member.roles.cache;
                const roleNames = roles.map(role => role.name);
                for (const roleName of roleNames) {
                    if(!noAddableRole.includes(roleName)) {
                        const techExists = await queries.checkIfTechnologyInTheDatabase(id, roleName);
                        if (!techExists) {
                            await queries.addTechToUserTechStack(id, roleName);
                        }
                    }
                }
            }
        })
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("collect missing data to the database for the proper work (must to run this command)")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        try {

            await interaction.reply({
                content: `:satellite: Setup process is starting...`,
                ephemeral: true
            });
            await interaction.followUp({
                content: `:hourglass: Updating user list...`,
                ephemeral: true
            });

            await storeMissingUserIds(interaction);

            // Send a message to acknowledge the user's command
            await interaction.followUp({
                content: `:white_check_mark: User list up to date.`,
                ephemeral: true
            });

            // Send a follow-up message with the next response
            await interaction.followUp({
                content: `:hourglass_flowing_sand: Updating user roles...`,
                ephemeral: true
            });

            await storeMissingUserRoles(interaction);

            // Send another follow-up message to indicate completion
            await interaction.followUp({
                content: `:white_check_mark: Roles up to date.`,
                ephemeral: true
            });
            await interaction.followUp({
                content: `:white_check_mark: Setup process is done ! `,
                ephemeral: true
            });

        } catch (error) {
            console.error(error);
            interaction.reply({
                content: ":x: An error occurred while updating user roles.",
                ephemeral: true
            });
        }
    }

}