const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        // Caculate bot's ping
        const ping = Date.now() - interaction.createdTimestamp;
        await interaction.reply({ content: `Pong! Bot's ping is ${ping}ms`, ephemeral: true});
    }
};