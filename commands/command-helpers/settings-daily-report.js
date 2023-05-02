const reportManager = require('../../actions/daily-report-manager.js')

async function dailyReportFunctionManager(interaction){
    if(interaction.options.getSubcommand() === "working"){
        if(interaction.options.getString("value") == "on"){
            reportManager.start()
            await interaction.reply({
                content:`Daily report functions started!`,
                ephemeral: true
            })
        }else{
            reportManager.stop()
            await interaction.reply({
                content:`Daily report functions stopped!`,
                ephemeral: true
            })
        }
    }else if(interaction.options.getSubcommand() === "closing"){
        if(interaction.options.getString("value") == "on"){
            reportManager.startClosing()
            await interaction.reply({
                content:`Daily report closing function started!`,
                ephemeral: true
            })
        }else{
            reportManager.stopClosing()
            await interaction.reply({
                content:`Daily report closing function stopped!`,
                ephemeral: true
            })
        }
    }else if(interaction.options.getSubcommand() === "status"){
        const statuses = await reportManager.getStatus()
        const open = statuses["open"]? "on" : "off"
        const close = statuses["close"]? "on" : "off"
        await interaction.reply({
            content:`Current statuses:\nOpen: ${open}\nClose: ${close}`,
            ephemeral: true
        })
    }else if(interaction.options.getSubcommand() === "thread"){
        const newStatus = interaction.options.getString("value")
        await reportManager.threadCreation(newStatus)
        await interaction.reply({
            content:`Thread creation is now in \'${newStatus}\' status!`,
            ephemeral: true
        })
    }
}
module.exports ={
    manager: dailyReportFunctionManager
}