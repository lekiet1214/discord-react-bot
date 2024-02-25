const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the music'),
    async execute(interaction) {
        const voiceConnection = getVoiceConnection(interaction.guildId);
        if (voiceConnection) {
            const audioPlayer = interaction.client.audioPlayers.get(interaction.guildId);
            if (audioPlayer) {
                audioPlayer.stop()
                interaction.client.audioPlayers.delete(interaction.guildId);
            }
            else {
                return await interaction.reply('I am not playing music in this server!');
            }
        } else {
            await interaction.reply('I am not playing music in this server!');
        }
    },
};