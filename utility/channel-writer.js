require('dotenv').config();
const env = process.env;

async function logInfo(client,msg){
    const logRoom = await getLogRoom(client)
    logRoom.send(`[INFO]: ${msg}`)
}

async function logError(client,msg){
    const logRoom = await getLogRoom(client)
    logRoom.send(`[ERROR]: ${msg}`)
}

async function logDebug(client,msg){
    const logRoom = await getLogRoom(client)
    logRoom.send(`[DEBUG]: ${msg}`)
}

async function logSuccess(client,msg){
    const logRoom = await getLogRoom(client)
    logRoom.send(`[SUCCESS]: ${msg}`)
}

async function getLogRoom(client){
    const logRoomId = env.LOG_ROOM_ID
    return await client.channels.cache.get(logRoomId)
}

module.exports = {
    logInfo,
    logDebug,
    logError,
    logSuccess,
}
