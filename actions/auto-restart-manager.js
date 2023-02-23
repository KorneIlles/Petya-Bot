const cron = require('cron');
require('dotenv').config();
const reportManager = require('../actions/daily-report-manager.js')
const env = process.env;

function autoRestart(client){
    dailyCheck = new cron.CronJob('00 00 00 * * *', () => {
    // This runs every day from to restart services

    const currentDate = new Date();
    const logRoomId = env.LOG_ROOM_ID
    const logChannel = client.channels.cache.get(logRoomId);
    if(env.DAILY_REPORT_STOP_DATE != ""){
        const dailyStopDate = new Date(env.DAILY_REPORT_STOP_DATE)
        if(dailyStopDate < currentDate){
            reportManager.stopDateReached()
            logChannel.send("Daily report manager restarted! Reason: Stop date reached")
        }
    }
    });
    dailyCheck.start()
}

module.exports={
    readyAutoRestart: autoRestart
}
