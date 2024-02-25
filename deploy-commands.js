const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const { set } = require('mongoose');
dotenv.config();

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

async function registerGuildCommands(command, guildId) {
	commandToSend = [];
	commandToSend.push(command);
	try {
		console.log(`Started refreshing command: ${command.name}`);
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
			{ body: commandToSend },
		);
		console.log(`Successfully refreshed command: ${command.name}`);
	} catch (error) {
		console.error(error);
	}
}

async function registerGlobalCommands(command) {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: command },
		);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
}

// get comamnds from commands.json
const commandJsonPath = path.join(__dirname, '/data/commands.json');
const commandData = fs.readFileSync(commandJsonPath, 'utf8');
const commandsJson = JSON.parse(commandData);

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

globalCommands = [];


function deployAll() {
	(async () => {
		for (const command of commands) {
			console.log(command.name)
			if (commandsJson[command.name][0] == "all") {
				globalCommands.push(command);
			} else {
				for (const guildId of commandsJson[command.name]) {
					console.log(`Registering guild command: ${command.name} for guild: ${guildId}`);
					await registerGuildCommands(command, guildId);
				}
			}
		}
		await registerGlobalCommands(globalCommands);
	})();

}

function deploy(commandToDeploy) {
	(async () => {
		if (commandsJson[commandToDeploy][0] == "all") {
			await registerGlobalCommands(commandToDeploy);
		} else {
			// get command from commands array
			const command = commands.find(cmd => cmd.name === commandToDeploy);
			if (command) {
				for (const guildId of commandsJson[commandToDeploy]) {
					console.log(`Registering guild command: ${command.name} for guild: ${guildId}`);
					await registerGuildCommands(command, guildId);
				}
			} else {
				console.log(`Command ${commandToDeploy} not found`);
			}
		}
	})();
}

const args = process.argv.slice(2);
if (args.length == 0) {
	deployAll();
} else {
	deploy(args[0]);
}