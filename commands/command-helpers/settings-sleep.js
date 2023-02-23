const reportManager = require('../../actions/daily-report-manager.js')
const envUpdater = require("../../utility/env-file-writer.js")
require('dotenv').config();
const env = process.env;

async function sleepDateManager(interaction){
    if (interaction.options.getSubcommand() === "set-date"){
        const year = interaction.options.getNumber('year').toString()
        let month = interaction.options.getNumber('month').toString()
        let day = interaction.options.getNumber('day').toString()
        if(year.length == 4 && month.length <= 2 && day.length <= 2){
            if(month.length == 1){
                month = "0"+month
            }
            if(day.length == 1){
                day = "0"+day
            }
            const now = new Date()
            const validDateFromInput = `${year}/${month}/${day}`
            const inputDate = new Date(validDateFromInput)
            if(inputDate < now){
                await interaction.reply({
                    content:`Try with something from the future dummy! (input: ${validDateFromInput})`,
                    ephemeral: true
                })
            }else{
                await reportManager.stopUntilDate(validDateFromInput)
                await interaction.reply({
                    content:`Bot is stopped until the following date: ${validDateFromInput}`,
                    ephemeral: true
                })
            }
        }else{
            await interaction.reply({
                content:`Invalid date format! (${year}/${month}/${day})`,
                ephemeral: true
            })
        }
    }else if(interaction.options.getSubcommand() === "remove-date"){
        if(env.DAILY_REPORT_STOP_DATE == ""){
            await interaction.reply({
                content:`No stop date is set, so you can't remove it!`,
                ephemeral: true
            })
        }else{
            env.DAILY_REPORT_STOP_DATE = ""
            envUpdater.rewriteEnvFile()
            await interaction.reply({
            content:`Stop date removed!`,
            ephemeral: true
            })
        }
        
    }else if(interaction.options.getSubcommand() === "view-date"){
        if(env.DAILY_REPORT_STOP_DATE == ""){
            await interaction.reply({
                content:`Currently no stop date is set!`,
                ephemeral: true
            })
        }else{
            await interaction.reply({
                content:`The current stop date is the following:\n${env.DAILY_REPORT_STOP_DATE}`,
                ephemeral: true
            })
        }
    }
}
module.exports ={
    manager: sleepDateManager
}