const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Say something as the bot')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text to say')
                .setRequired(true)),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        // Send the text to the channel without a reply
        await interaction.channel.send(text);
        
    }
};