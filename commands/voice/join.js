const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const { connection } = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join the voice channel'),
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command', ephemeral: true });
        }
        // get channel id
        const channelId = interaction.member.voice.channel.id;
        // join the channel
        try {
            const connection = joinVoiceChannel({
                channelId: channelId,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator
            });
        } catch (error) {
            console.error(error);
            return await interaction.reply({ content: 'Error occurred while joining the voice channel', ephemeral: true });
        }
        connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
            try {
                await Promise.race([
                    entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                    entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                ]);
                // Seems to be reconnecting to a new channel - ignore disconnect
            } catch (error) {
                // Seems to be a real disconnect which SHOULDN'T be recovered from

                connection.destroy();
            }
        });
        return await interaction.reply({ content: `Joined the voice channel <#${channelId}>`, ephemeral: true });
    }
};