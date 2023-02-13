const {SlashCommandBuilder} = require('discord.js');
require('dotenv').config();


module.exports = {
    data: new SlashCommandBuilder()
        .setName('week')
        .setDescription('This command helps you to choose your week or switch if it\'s needed!')
        .addStringOption(option =>
            option
                .setName('option')
                .setDescription('Choose week A, B, switch between them or get help!')
                .setRequired(true)
                .addChoices(
                    {name: 'A', value: "week_A"},
                    {name: "B", value: "week_B"},
                    {name: "help", value: "help"},
                    {name: "switch", value: "switch"}
                )),

    async execute(interaction) {
        const option = interaction.options.getString('option')
        if(option == "week_A"){
            const role_id = process.env.WEEK_A_ROLE_ID
            const role = interaction.guild.roles.cache.get(role_id);
            interaction.member.roles.add(role)
            await interaction.reply({
                content: `You're now Week A!`,
                ephemeral: true
            });
        }else if(option == "week_B"){
            const role_id = process.env.WEEK_B_ROLE_ID
            const role = interaction.guild.roles.cache.get(role_id);
            interaction.member.roles.add(role)
            await interaction.reply({
                content: `You're now Week B!`,
                ephemeral: true
            });
        }else if(option == "help"){
            const evenWeek = process.env.EVEN_WEEK
            const oddWeek = process.env.ODD_WEEK
            currentDate = new Date(); //current date
            startDate = new Date(currentDate.getFullYear(), 0, 1);  //January 1.
            let days = Math.floor((currentDate - startDate) / //get the days until now
                (24 * 60 * 60 * 1000));
            
            let currentWeekNumber = Math.ceil(days / 7); //get the number of weeks until now from days
            let currentWeekLetter = currentWeekNumber%2 == 0 ? evenWeek : oddWeek


            await interaction.reply({
                content: `If your current week is SI, then your week is: ${currentWeekLetter}!`,
                ephemeral: true
            });


        }else if(option == "switch"){
            const aWeekRoleId = process.env.WEEK_A_ROLE_ID
            const bWeekRoleId = process.env.WEEK_B_ROLE_ID
            if(interaction.member.roles.cache.has(aWeekRoleId)){
                interaction.member.roles.remove(aWeekRoleId)
                interaction.member.roles.add(bWeekRoleId)
                await interaction.reply({
                    content: `You are now on week: B!`,
                    ephemeral: true
                });
            }else if(interaction.member.roles.cache.has(bWeekRoleId)){
                interaction.member.roles.remove(bWeekRoleId)
                interaction.member.roles.add(aWeekRoleId)
                await interaction.reply({
                    content: `You are now on week: A!`,
                    ephemeral: true
                });
            }else{
                await interaction.reply({
                    content: `You are not on either week, choose one first!`,
                    ephemeral: true
                });
            }
            
        }
    },
};