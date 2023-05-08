const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js');
const queries = require('../database/database-queries.js');
const utils = require('../utility/StringManipulator.js')

async function getStudentTechnologies(student){
    const technologiesEmbedFormat = [{ name: 'Technologies:', value: '\u000A' }]
    const technologies = await queries.getTechnologies(student.id);
    for (let i = 0; i < technologies.length; i++){
        const technology = technologies[i];
        i+1 === technologies.length ?
        technologiesEmbedFormat.push({ name: technology.technology, value: '\u000A', inline: true },):
        technologiesEmbedFormat.push({ name: `${technology.technology},`, value: '\u000A', inline: true },);
    }
    return technologiesEmbedFormat
}

async function createUserEmbed(student) {
    const embed = new EmbedBuilder()
        .setColor(`#${utils.randomColorHexCodeGenerator()}`)
        .setTitle(`${student.nickname || student.user.username}'s Profile`)
        .setThumbnail(student.user.avatarURL())
        .addFields(await getStudentTechnologies(student))

        .setTimestamp();
    return embed;
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('student')
        .setDescription('get all data about a student.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
                option.setName('student')
                    .setDescription('Select a student')
                    .setRequired(true)),

    async execute(interaction) {
        const baseStudentData = interaction.options.getUser('student')
        const student = interaction.guild.members.cache.get(baseStudentData.id)
        const embed = await createUserEmbed(student);
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })

    }
}