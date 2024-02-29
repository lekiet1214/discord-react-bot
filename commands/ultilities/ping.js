const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		await interaction.editReply('Pong!');
		const sent = await interaction.followUp({ content: `Websocket heartbeat: ${interaction.client.ws.ping}ms.`, ephemeral: true });
		await interaction.followUp({ content: `Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`, ephemeral: true });
	},
};