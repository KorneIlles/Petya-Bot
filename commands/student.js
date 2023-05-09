const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js');
const queries = require('../database/database-queries.js');
const utils = require('../utility/StringManipulator.js')

async function getStudentTechnologies(student){
    const technologiesEmbedFormat = [{ name: 'Technologies:', value: '\u000A' }]
    const technologies = await queries.getTechnologies(student.id);
    for (let i = 0; i < technologies.length; i++){
        const technology = technologies[i];
        technologiesEmbedFormat.push({ name: `> ${technology.technology}`, value: '\u000A'},);
    }
    technologiesEmbedFormat.push({ name:'\u000A', value: `<@${student.user.id}>`})
    return technologiesEmbedFormat
}

async function createUserEmbed(student) {
    const embed = new EmbedBuilder()
        .setColor(`#${utils.randomColorHexCodeGenerator()}`)
        .setTitle(`${student.nickname || student.user.username}'s Profile`)
        .setThumbnail(student.user.displayAvatarURL())
        .addFields(await getStudentTechnologies(student))

        .setTimestamp();
    return embed;
}


async function getAllEmbeds(students) {
    const embeds = []
    for (const student of students) {
        const embed = await createUserEmbed(student);
        embed.setFields([{ name:'\u000A', value: `<@${student.user.id}>`}])
        embeds.push(embed)
    }
    return embeds
}

async function getAllStudent(students,roleId) {
    let studentsTextFormat = `The following students have <@&${roleId}> experience:\u000A`
    for (const student of students) {
      studentsTextFormat += `> <@${student.user.id}>` + '\u000A';
    }
    return studentsTextFormat
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('student')
        .setDescription('get student(s) data')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("get")
                .setDescription('get all data about a student.')
                .addUserOption(option =>
                            option
                                .setName("student")
                                .setDescription("select a student")
                                .setRequired(true)))
        .addSubcommand((subcommand) =>
            subcommand
                .setName("filter")
                .setDescription('get all data about a student.')
                .addRoleOption(option =>
                    option
                        .setName("role")
                        .setDescription("select a role")
                        .setRequired(true))),

    async execute(interaction) {
        const option = interaction.options._subcommand;

        switch (option) {
            case 'get':
                const baseStudentData = interaction.options.getUser('student')
                const student = interaction.guild.members.cache.get(baseStudentData.id)
                const embed = await createUserEmbed(student);
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });
                break;
            case 'filter':
                const role = interaction.options.getRole('role');
                interaction.guild.members.fetch().then(async members => {
                    const membersMap = members.filter(member => member.roles.cache.has(role.id));
                    const students = Array.from(membersMap.values());
                    if(students.length<=2){
                        const allEmbeds = await getAllEmbeds(students);
                        interaction.reply({
                            content:`The following student(s) have <@&${role.id}> experience:\u000A`,
                            embeds: allEmbeds,
                            ephemeral: true
                        });
                    }else{
                        const studentsList = await getAllStudent(students, role.id)
                        interaction.reply({
                            content: studentsList,
                            ephemeral: true
                        });
                    }

                }).catch(console.error);
                break;
        }
    }
}