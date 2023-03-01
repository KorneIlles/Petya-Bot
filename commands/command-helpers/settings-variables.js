const envUpdater = require("../../utility/env-file-writer.js")
require('dotenv').config();
const env = process.env;

async function enviromentalVariableManager(interaction){
    if(interaction.options.getSubcommand() === "rooms"){
        const roomType = interaction.options.getString("room-type")
        const roomID = interaction.options.getString("room-id")
        const minimumRoomIdLength = 18
        if(isNaN(roomID)){
            await interaction.reply({
                content:`Invalid roomID.\nReason: Not all characters in the input is a number (input: ${roomID})`,
                ephemeral: true
            })
        }else if(roomID.length < minimumRoomIdLength){
            await interaction.reply({
                content:`Invalid roomID.\nReason: Input is shorter than 18 characters (input: ${roomID})`,
                ephemeral: true
            })
        }else{
            if(roomType == "daily"){
                env.DAILY_REPORT_ROOM_ID = roomID
            }else if(roomType == "log"){
                env.LOG_ROOM_ID = roomID
            }else if(roomType == "welcome"){
                env.WELCOME_ROOM_ID = roomID
            }
            envUpdater.rewriteEnvFile()
            await interaction.reply({
                content:`Room type \'${roomType}\' successfully changed to: \'${roomID}\'`,
                ephemeral: true
            })
        }  
    }else if(interaction.options.getSubcommand() === "week-switch"){
        const currentEvenWeek = env.EVEN_WEEK
        const currentOddWeek = env.ODD_WEEK
        env.EVEN_WEEK = currentOddWeek
        env.ODD_WEEK = currentEvenWeek
        envUpdater.rewriteEnvFile()
        await interaction.reply({
            content:`Even and Odd weeks successfully switched!\nNew Even week: ${env.EVEN_WEEK}\nNew Odd week:${env.ODD_WEEK}`,
            ephemeral: true
        })
    }
}
module.exports ={
    manager: enviromentalVariableManager
}