const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const sleepGroup = require("./command-helpers/settings-sleep.js")
const dailyReportGroup = require("./command-helpers/settings-daily-report.js")
const variablesGroup = require("./command-helpers/settings-variables.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Configure the bot features as you like!')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers)
        .addSubcommandGroup((group) =>
            group
                .setName("sleep")
                .setDescription("manage bot turn off time")
                .addSubcommand((subcommand) =>
                subcommand
                    .setName("set-date")
                    .setDescription("Until this date given (date included), the bot is in sleeping mode")
                    .addNumberOption(option =>
                        option
                            .setName('year')
                            .setDescription('stop date year (e.g.: 2023)')
                            .setRequired(true)
                            )
                    .addNumberOption(option =>
                        option
                            .setName('month')
                            .setDescription('stop date month (e.g.: 02)')
                            .setRequired(true)
                            )
                    .addNumberOption(option =>
                        option
                            .setName('day')
                            .setDescription('stop date day (e.g.:01')
                            .setRequired(true)
                            )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('remove-date')
                        .setDescription('This command removes the date until the bot is stopped'))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('view-date')
                        .setDescription('This command shows the given date until the bot is stopped (if there is any)'))
        )
        .addSubcommandGroup((group) =>
            group
                .setName("daily-report")
                .setDescription("manage the configurations related to daily reports")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('working')
                        .setDescription('You can turn on/off the daily report function (both opening and closing function changes)')
                        .addStringOption(option =>
                            option.setName('value')
                                .setDescription('on - turn on the functions , off - turn off the functions')
                                .setRequired(true)
                                .addChoices(
                                    {name: "on", value: "true"},
                                    {name: "off", value: "false"},
                                )))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('closing')
                        .setDescription('You can turn on/off the daily report closing function (only closing)')
                        .addStringOption(option =>
                            option.setName('value')
                                .setDescription('on - turn on the function , off - turn off the function')
                                .setRequired(true)
                                .addChoices(
                                    {name: "on", value: "true"},
                                    {name: "off", value: "false"},
                                )))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('status')
                        .setDescription('This command will show you the status of the daily-report opening and closing features'))

        )
        .addSubcommandGroup((group) =>
        group
            .setName("variables")
            .setDescription("manage the configurations of the enviromental variables")
            .addSubcommand(subcommand =>
                subcommand
                    .setName('rooms')
                    .setDescription('You can turn on/off the daily report function (both opening and closing function changes)')
                    .addStringOption(option =>
                        option.setName('room-type')
                            .setDescription('Choose a room type')
                            .setRequired(true)
                            .addChoices(
                                {name: "Daily report", value: "daily"},
                                {name: "Logger", value: "log"},
                                {name: "Welcome", value: "welcome"},
                            ))
                    .addStringOption(option =>
                        option.setName('room-id')
                            .setDescription('New room id (e.g:1074663232222015501), you can copy a room ID by right click on it -> Copy ID') //minimum 18 number length
                            .setRequired(true)))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('week-switch')
                    .setDescription('Switch the Odd and Even weeks with each other'))
    ),
    async execute(interaction) {
        const selectedGroup = interaction.options.getSubcommandGroup()
        if(selectedGroup == "sleep"){
            await sleepGroup.manager(interaction)
        }else if(selectedGroup == "daily-report"){
            await dailyReportGroup.manager(interaction)
        }else if(selectedGroup == "variables"){
            await variablesGroup.manager(interaction)
        }
    },
};