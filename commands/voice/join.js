const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join the voice channel'),
    async execute(interaction) {
        if (!interaction.member.voice.channelId) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command', ephemeral: true });
        }
        // get channel id
        const channelId = interaction.member.voice.channel.id;
        // join the channel
        try {
            const voiceConnection = joinVoiceChannel({
                channelId: channelId,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
                selfDeaf: false,
                selfMute: false
            });
            voiceConnection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
                try {
                    await Promise.race([
                        entersState(voiceConnection, VoiceConnectionStatus.Signalling, 5_000),
                        entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5_000),
                    ]);
                    // Seems to be reconnecting to a new channel - ignore disconnect
                } catch (error) {
                    // Seems to be a real disconnect which SHOULDN'T be recovered from

                    voiceConnection.destroy();
                }
            });
        } catch (error) {
            console.error(error);
            return await interaction.reply({ content: 'Error occurred while joining the voice channel', ephemeral: true });
        }

        return await interaction.reply({ content: `Joined the voice channel <#${channelId}>`, ephemeral: true });
    }
};