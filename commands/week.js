const {SlashCommandBuilder} = require('discord.js');
const timeCalculation = require('../utility/time-calculation.js');
require('dotenv').config();

function alreadyHaveRole(interaction){
    const aWeekRoleId = process.env.WEEK_A_ROLE_ID
    const bWeekRoleId = process.env.WEEK_B_ROLE_ID
    const hasAWeekRole = interaction.member.roles.cache.has(aWeekRoleId)
    const hasBWeekRole = interaction.member.roles.cache.has(bWeekRoleId)
    return hasAWeekRole || hasBWeekRole
}

async function addRole(interaction, week){
    const role_id = week.toUpperCase() == "A"? process.env.WEEK_A_ROLE_ID : week.toUpperCase()  == "B" ? process.env.WEEK_B_ROLE_ID : "error"
    if(role_id == "error"){
        console.log("Wrong week parameter in week.js -> addRole() function!")
    }else{
        const role = interaction.guild.roles.cache.get(role_id);
        interaction.member.roles.add(role)
        await interaction.reply({
            content: `You're now Week ${week}!`,
            ephemeral: true
        });
    }
    
}


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
        if(option == "week_A" || option == "week_B"){
            if(alreadyHaveRole(interaction)){
                await interaction.reply({
                    content: `You already have a week, if you want to switch it, use the \'/week switch\' command!`,
                    ephemeral: true
                });
            }else{
                if(option == "week_A"){
                    addRole(interaction, "A")
                }else if(option == "week_B"){
                    addRole(interaction, "B")
                }
            }
        }
        else if(option == "help"){
            const evenWeekLetter = process.env.EVEN_WEEK
            const oddWeekLetter = process.env.ODD_WEEK

            let currentWeekLetter = timeCalculation.isEvenWeek() ? evenWeekLetter : oddWeekLetter


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