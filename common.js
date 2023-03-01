const fs = require('node:fs');
const path = require('node:path');

// helps to construct a path to the selected directory
const commandsPath = path.join(__dirname, 'commands');
const eventsPath = path.join(__dirname, 'events');
const modalsPath = path.join(__dirname,'modals');
module.exports = {
    commandsPath: commandsPath,
    eventsPath: eventsPath,
    modalsPath: modalsPath,
    // reads the path to the directory and returns an array of all the file names it contains
    commandFiles: fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')),
    eventFiles: fs.readdirSync(eventsPath).filter(file => file.endsWith('.js')),
    modalFiles: fs.readdirSync(modalsPath).filter(file => file.endsWith('.js'))
};