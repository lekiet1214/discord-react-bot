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
                .setDescription('The reaction to add')
                .setRequired(false)),
    async execute(interaction) {
        // Get emoji from command
        const emoji = interaction.options.getString('reaction');
        // Get the path to the file 
        const filePath = path.join(__dirname, '/../../data/reactData.json');
        // Read the file
        const fileData = fs.readFileSync(filePath, 'utf8');
        // Parse the file
        const jsonData = JSON.parse(fileData);
        // Get user's current emoji list
        const userEmojiList = jsonData[interaction.user.id][interaction.guild.id];
        // Check if the emoji is already in the list
        if (userEmojiList.includes(emoji)) {
            // remove the emoji from the list
            userEmojiList.splice(userEmojiList.indexOf(emoji), 1);
        }
        // Write the file
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
        // Upload the file to MongoDB
        uploadJson(filePath, 'reactData');
        
        await interaction.reply({ content: `Removed ${emoji} from your list of reactions`, ephemeral: true});

    }
};