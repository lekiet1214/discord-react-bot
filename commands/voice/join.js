const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');

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
            const connection = joinVoiceChannel ({
                channelId: channelId,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator
            });
        } catch (error) {
            console.error(error);
            return await interaction.reply({ content: 'Error occurred while joining the voice channel', ephemeral: true });
        }
        return await interaction.reply({ content: `Joined the voice channel <#${channelId}>`, ephemeral: true });
    }
};