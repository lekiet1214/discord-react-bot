const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const { uploadJson } = require('../../mongoDb');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removereact')
        .setDescription('Add a reaction to the list of reactions')
        .addStringOption(option =>
            option.setName('reaction')
                .setDescription('The reaction to add. Leave empty to remove all reactions from your list')
                .setRequired(false)),
    async execute(interaction) {
        // Get emoji from command
        emoji = interaction.options.getString('reaction');
        if (!emoji) {
            emoji = 'all'
        }
        // Get the path to the file 
        const filePath = path.join(__dirname, '/../../data/reactData.json');
        // Read the file
        const fileData = fs.readFileSync(filePath, 'utf8');
        // Parse the file
        const jsonData = JSON.parse(fileData);
        // Get user's current emoji list
        userEmojiList = jsonData[interaction.user.id][interaction.guild.id];
        // Check if the emoji is already in the list
        if (emoji == 'all') {
            userEmojiList = [];
            // Write the file
            fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
            // Upload the file to MongoDB
            uploadJson(filePath, 'reactData');
            return await interaction.reply({ content: `Removed all reactions from your list`, ephemeral: true });
        }
        else {
            if (userEmojiList.includes(emoji)) {
                // remove the emoji from the list
                userEmojiList.splice(userEmojiList.indexOf(emoji), 1);
            }
            else {
                return await interaction.reply({ content: `You don't have ${emoji} in your list of reactions`, ephemeral: true });
            }
        }
        // Write the file
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
        // Upload the file to MongoDB
        uploadJson(filePath, 'reactData');

        return await interaction.reply({ content: `Removed ${emoji} from your list of reactions`, ephemeral: true });
    }
};