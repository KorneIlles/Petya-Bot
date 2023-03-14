const cron = require('cron');
require('dotenv').config();
const timeCalculator = require("../utility/time-calculation.js")
const envUpdater = require("../utility/env-file-writer.js")

const env = process.env
let roleId = ""
let dailyReportThreadId = ""
let dailyReportOpening = null
let dailyReportClosing = null
let isOpeningRun = null
let isClosingRun = null

async function dailyReportReady(client){
  dailyReportOpening = new cron.CronJob('00 00 9 * * 2-4',async () => {
    // This runs every day from Tuesday-Thursday at 9:00:00
    
    const roomId = env.DAILY_REPORT_ROOM_ID
    let channel = client.channels.cache.get(roomId);
    const isEvenWeek = timeCalculator.isEvenWeek()
    if(isEvenWeek){
      roleId = getCurrentWeekId(env.EVEN_WEEK)
    }else{
      roleId = getCurrentWeekId(env.ODD_WEEK)
    }
    await channel.send(`Daily report for: <@&${roleId}>`)
    createNewThread(channel).then((thread) => {
      dailyReportThreadId = thread.id
    })
      
  });
  dailyReportClosing = new cron.CronJob('00 00 10 * * 2-4', async () => {
    // This runs every day from Tuesday-Thursday at 10:00:00
    
    const roomId = env.DAILY_REPORT_ROOM_ID
    const channel = client.channels.cache.get(roomId);  //get daily report channel from roomID
    const thread = channel.threads.fetch(dailyReportThreadId) //get thread by ID
    
    const guild = client.guilds.cache.get(env.SERVER_ID);
    await guild.members.fetch() //cache all current users

    let role = await guild.roles.fetch(roleId)
    let memberList = role.members
    try{
      let memberListTags = memberList.map(user=>user.id); // users in role
    }catch(err){
      console.log("AN ERRROR OCCURED WHILE CLOSING DAILY REPORT")
    }
  });
  const currentDate = new Date()
  const stopDate = new Date(env.DAILY_REPORT_STOP_DATE)
  if(currentDate>=stopDate){
    dailyReportOpenOnReachedDay()
  }else if(env.DAILY_REPORT_STOP_DATE == ""){
    dailyReportOpen()
  }else{
    dailyReportClose()
  }
}

async function dailyReportOpen(){
  // When you want to start it, use:
  isOpeningRun = true
  isClosingRun = true
  dailyReportOpening.start()
  dailyReportClosing.start()
}

async function dailyReportOpenOnReachedDay(){
  isOpeningRun = true
  isClosingRun = true
  env.DAILY_REPORT_STOP_DATE = ""
  envUpdater.rewriteEnvFile()
  dailyReportOpening.start()
  dailyReportClosing.start()
}

async function dailyReportClose(){
    // You could also make a command to pause and resume the job
  isOpeningRun = false
  isClosingRun = false
  dailyReportOpening.stop()
  dailyReportClosing.stop()
}

async function dailyReportCloseUntilDate(date){
  isOpeningRun = false
  isClosingRun = false
  env.DAILY_REPORT_STOP_DATE = date
  envUpdater.rewriteEnvFile()
  dailyReportOpening.stop()
  dailyReportClosing.stop()
}

async function dailyReportClosingOpen(){
  isClosingRun = true
  dailyReportClosing.start()
}

async function dailyReportClosingClose(){
  isClosingRun = false
  dailyReportClosing.stop()
}

async function getOpenCloseStatus(){
  return {open: isOpeningRun, 
          close: isClosingRun}
}

/**
 * @description With the use of this function we can activate or deactivate the thread making when a new daily report is created
 *
 * @param {String} newStatus Needs to be a String value, with the following options:
 * - **on** -  the bot is making a thread, when writes in the daily report channel
 * - **off** - the bot is not making the thread
 * 
 */
async function openingThreadCreationStatusChanger(newStatus){
  const validInputs = ["on", "off"]
  if(validInputs.includes(newStatus.toLowerCase())){
    env.DAILY_REPORT_OPENING_THREAD = newStatus.toUpperCase()
    await envUpdater.rewriteEnvFile()
  }else{
    console.log(`INVALID PARAMETER GIVEN FOR \'openingThreadCreationStatusChanger\'\n Given variable is: ${newStatus} instead of ${validInputs.join(", ")}`)
  }

  
}

async function createNewThread(channel){
  const weekNumber = timeCalculator.getWeeksUntilNow()
  const dayName = timeCalculator.dayNameFromToday("en-US")
  return await channel.threads.create({
    name: `Daily report, Week ${weekNumber} ${dayName}`,
    autoArchiveDuration: 60,
    reason: 'Daily report thread',
  });
}

function getCurrentWeekId(weekLetter){
  if(weekLetter == "A"){ // Current week is always SI, so we need TW week role
    return env.WEEK_B_ROLE_ID
  }else if(weekLetter == "B"){
    return env.WEEK_A_ROLE_ID
  }else{
    return "NO_ID"
  }
}

module.exports = {
  ready: dailyReportReady,
  start: dailyReportOpen,
  startClosing: dailyReportClosingOpen,
  stop: dailyReportClose,
  stopDateReached: dailyReportOpenOnReachedDay,
  stopUntilDate: dailyReportCloseUntilDate,
  stopClosing: dailyReportClosingClose,
  getStatus: getOpenCloseStatus,
}