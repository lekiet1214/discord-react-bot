const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Displays a list of all commands'),

	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setTitle('Help')
			.setColor(0x0099FF)
			.setTimestamp();

		const commandsPath = path.join(__dirname, '../../commands');
		const categories = fs.readdirSync(commandsPath);
		categories.forEach(category => {
			const categoryPath = path.join(commandsPath, category);
			const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));
			const commands = commandFiles.map(file => require(path.join(categoryPath, file)));
			if (commands.length > 0) {
				const commandsString = commands.map(command => `**${command.data.name}**: ${command.data.description}`).join('\n');
				embed.addFields({ name: `**${category.toUpperCase()}**`, value: commandsString });
			}
		});

		await interaction.reply({ embeds: [embed] });
	},
};
