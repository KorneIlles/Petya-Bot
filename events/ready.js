const { Events } = require('discord.js');
const reportManager = require('../actions/daily-report-manager.js')
const restartManager = require("../actions/auto-restart-manager.js")

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`JobHunt-bot started! Logged in as ${client.user.tag}`);
        reportManager.ready(client)
        restartManager.readyAutoRestart(client)
    },
};