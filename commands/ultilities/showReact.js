const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const { uploadJson } = require('../../mongoDb');
const { Message } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('showreact')
        .setDescription('Show your list of reactions'),
    async execute(interaction) {
        // Get the path to the file 
        const filePath = path.join(__dirname, '/../../data/reactData.json');
        // Read the file
        const fileData = fs.readFileSync(filePath, 'utf8');
        // Parse the file
        const jsonData = JSON.parse(fileData);
        // Get user's current emoji list
        const userEmojiList = jsonData[interaction.user.id][interaction.guild.id];
        // reply with the list
        convertedList = []
        for (const emoji of userEmojiList) {
            // try to get custom emoji
            const customEmoji = interaction.guild.emojis.cache.get(emoji);
            if (customEmoji) {
                convertedList.push(customEmoji);
            } else {
                convertedList.push(emoji);
            }
        }
        const replyMessage = await interaction.reply({ content: `Your list of reactions: ${convertedList.join(', ')}`, ephemeral: true });
    }
};