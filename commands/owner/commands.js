const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const { uploadJson } = require('../../mongoDb');

const { OWNER_ID } = process.env;
const owners = OWNER_ID.split(',');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('commands')
        .setDescription('modiify commands')
        .addBooleanOption(option =>
            option.setName('add')
                .setDescription('True to add, False to remove')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the command')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('Guild Id')
                .setDescription('The guild id')
                .setRequired(true)),
    async execute(interaction) {
        if (!(interaction.user.id in owners)) {
            const commandsPath = path.join(__dirname, '/../../data/commands.json');
            const fileData = fs.readFileSync(commandsPath, 'utf8');
            const jsonData = JSON.parse(fileData);
            const guildId = interaction.options.getString('Guild Id');
            const commandName = interaction.options.getString('name');
            const add = interaction.options.getBoolean('add');
            const guildIdPath = path.join(__dirname, `/../../data/guildId.json`);
            const guildIdData = fs.readFileSync(guildIdPath, 'utf8');
            const guildIdJson = JSON.parse(guildIdData);
            if (!(guildId in guildIdJson)) {
                await interaction.reply({ content: `Guild not found`, ephemeral: true });
                return;
            }
            if (!(commandName in jsonData)) {
                await interaction.reply({ content: `Command not found`, ephemeral: true });
                return;
            }
            if (add) {
                if (jsonData[commandName].includes(guildId)) {
                    await interaction.reply({ content: `Command already exists`, ephemeral: true });
                    return;
                }
                jsonData[commandName].push(guildId);
                fs.writeFileSync(commandsPath, JSON.stringify(jsonData, null, 2), 'utf8');
                uploadJson(commandsPath, 'commands');
                await interaction.reply({ content: `Command added`, ephemeral: true });
            }
            else {
                if (!jsonData[commandName].includes(guildId)) {
                    await interaction.reply({ content: `Command does not exist`, ephemeral: true });
                    return;
                }
                jsonData[commandName].splice(jsonData[commandName].indexOf(guildId), 1);
                fs.writeFileSync(commandsPath, JSON.stringify(jsonData, null, 2), 'utf8');
                uploadJson(commandsPath, 'commands');
                await interaction.reply({ content: `Command removed`, ephemeral: true });
            }

        }
    }
};