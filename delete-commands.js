const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// for guild-based commands
const fs = require('fs');
const path = require('path');
const guildIdPath = path.join(__dirname, '/data/guildId.json');
const guildIdData = fs.readFileSync(guildIdPath, 'utf8');
const guildIds = JSON.parse(guildIdData);
for (const guildId of guildIds) {
	rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), { body: [] })
		.then(() => console.log(`Successfully deleted all guild commands for guild ID: ${guildId}`))
		.catch(console.error);
}

// for global commands
rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);