const cron = require('cron');
require('dotenv').config();
const timeCalculator = require("../utility/time-calculation.js")
const {RichEmbed} = require('discord.js');

let roleId = ""
let dailyReportThreadId = ""
let dailyReportOpening = null
let dailyReportClosing = null

async function dailyReportReady(client){
  dailyReportOpening = new cron.CronJob('00 00 9 * * 2-4',async () => {
    // This runs every day from Tuesday-Thursday at 9:00:00
    
    const roomId = process.env.DAILY_REPORT_ROOM_ID
    let channel = client.channels.cache.get(roomId);
    const isEvenWeek = timeCalculator.isEvenWeek()
    if(isEvenWeek){
      roleId = getCurrentWeekId(process.env.EVEN_WEEK)
    }else{
      roleId = getCurrentWeekId(process.env.ODD_WEEK)
    }
    await channel.send(`Daily report for: <@&${roleId}>`)
    createNewThread(channel).then((thread) => {
      dailyReportThreadId = thread.id
    })
      
  });
  dailyReportClosing = new cron.CronJob('00 00 10 * * 2-4', async () => {
    // This runs every day from Tuesday-Thursday at 10:00:00
    
    const roomId = process.env.DAILY_REPORT_ROOM_ID
    const channel = client.channels.cache.get(roomId);  //get daily report channel from roomID
    const thread = channel.threads.fetch(dailyReportThreadId) //get thread by ID
    
    const guild = client.guilds.cache.get("1039846791304183879");
    await guild.members.fetch().then((members) => {  //cache all current users
      members.map(member => console.log(member._roles))
     });

    let role = await guild.roles.fetch(roleId)
    let memberList = role.members
    let memberListTags = memberList.map(user=>user.id); // users in role
  });
  
  dailyReportOpen()
}

function dailyReportOpen(){
  // When you want to start it, use:
  dailyReportOpening.start()
  dailyReportClosing.start()
}

function dailyReportClose(){
    // You could also make a command to pause and resume the job
  dailyReportOpening.stop()
  dailyReportClosing.stop()
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
  const weekAId = process.env.WEEK_A_ROLE_ID;
  const weekBId = process.env.WEEK_B_ROLE_ID;
  if(weekLetter == "A"){
    return weekAId
  }else if(weekLetter == "B"){
    return weekBId
  }else{
    return "NO_ID"
  }
}

module.exports = {
  ready: dailyReportReady,
  start: dailyReportOpen,
  stop: dailyReportClose
}