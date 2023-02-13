const { Events } = require('discord.js');
require('dotenv').config();


const logRoomId = process.env.LOG_ROOM_ID

module.exports = {
    name: Events.GuildMemberAdd,
    execute(member) {
        member.client.channels.cache.get(logRoomId).send({content:'New student: '+"<@" + member.user.id + ">"+ '!'})

    },
};