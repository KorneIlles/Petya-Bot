const {Events} = require('discord.js');
const queries = require('../database/database-queries.js');
const utils = require("../utility/StringManipulator");
require('dotenv').config();

const logRoomId = process.env.LOG_ROOM_ID;
const welcomeRoomId = process.env.WELCOME_ROOM_ID;

async function addRoles(member) {
    try {
        const guild = member.guild;
        const userId = member.user.id;
        const roles = await queries.getTechnologies(userId);
        for (let i = 0; i < roles.length; i++) {
            const techName = roles[i].technology;
            const role = guild.roles.cache.find((role) => role.name === techName);
            if (role) {
                // If role already exists, assign it to the user
                member.roles.add(role).then(console.log(`Assigned role "${role.name}" to user "${member.user.tag}"`)).catch(console.error);
            } else {
                // Create a new role with the name of the technology
                guild.roles
                    .create({
                        name: techName,
                        color: utils.randomColorHexCodeGenerator(),
                    })
                    .then((role) => {
                        console.log(`Created role "${role.name}"`);
                        // Assign the role to the user who started the interaction
                        member.roles
                            .add(role)
                            .then(console.log(`Assigned role "${role.name}" to user "${member.user.tag}"`))
                            .catch(console.error);
                    })
                    .catch(console.error);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    name: Events.GuildMemberAdd,
    execute(member) {
        member.client.channels.cache.get(welcomeRoomId).send({content: 'New student: ' + "<@" + member.user.id + ">" + '!'}),
        member.client.channels.cache.get(logRoomId).send({content: 'Log > New student: ' + "<@" + member.user.id + ">" + '!'})

        queries.checkIfIdExists( member.user.id)
            .then(async idExists => {
                if (!idExists) {
                    queries.addUserToDatabase(member.user.id, member.user.username);
                } else {
                    console.log("user already exist in the database")
                    await addRoles(member)
                }// true if ID exists in user table, false otherwise
            })
            .catch(error => {
                console.error(error);
            });
    }
};