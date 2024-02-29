const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Leave the voice channel'),
	async execute(interaction) {
		if (!interaction.member.voice.channelId) {
			return interaction.reply({ content: 'You need to be in a voice channel to use this command', ephemeral: true });
		}
		// Get the voice connection
		const voiceConnection = getVoiceConnection(interaction.guild.id);
		if (voiceConnection) {
			voiceConnection.destroy();
			if (interaction.client.audioPlayers.get(interaction.guild.id)) {
				interaction.client.audioPlayers.delete(interaction.guild.id);
			}
			return interaction.reply({ content: 'Left the voice channel', ephemeral: true });
		}
		else {
			return interaction.reply({ content: 'I am not in a voice channel', ephemeral: true });
		}
	},
};