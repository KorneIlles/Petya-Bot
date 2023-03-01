const {Events} = require('discord.js');
const queries = require('../database/database-queries.js');
require('dotenv').config();

const logRoomId = process.env.LOG_ROOM_ID;
const welcomeRoomId = process.env.WELCOME_ROOM_ID;

module.exports = {
    name: Events.GuildMemberAdd,
    execute(member) {
        member.client.channels.cache.get(welcomeRoomId).send({content: 'New student: ' + "<@" + member.user.id + ">" + '!'}),
        member.client.channels.cache.get(logRoomId).send({content: 'Log > New student: ' + "<@" + member.user.id + ">" + '!'})

        queries.checkIfIdExists( member.user.id)
            .then(idExists => {
                console.log(idExists);
                if (!idExists){
                    queries.addUserToDatabase(member.user.id, member.user.username);
                }else {
                    console.log("user already exist in the database")
                }// true if ID exists in user table, false otherwise
            })
            .catch(error => {
                console.error(error);
            });
    }
};