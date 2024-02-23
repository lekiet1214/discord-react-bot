const { ActivityType, Events } = require('discord.js');
const fs = require('fs').promises; // Use fs.promises for promise-based file operations
const path = require('path');
const { uploadJson } = require('../mongoDb');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(readyClient) {
        console.log(`Ready lol!`);
        const Guilds = readyClient.guilds.cache.map(guild => guild.id);
        // Write guilds to guildid.json
        const guildIdPath = path.join(__dirname, '../data/guildId.json');

        // Open the file asynchronously
        let fileHandle;
        try {
            await fs.access(guildIdPath);
        } catch (err) {
            // Handle errors, if any
            if (err.code === 'ENOENT') {
                // Create the file if it doesn't exist
                console.log("Creating guildId.json...");
                await fs.writeFile(guildIdPath, '[]');
            } else {
                console.error("Error:", err);
                return; // Stop execution if there's an error
            }
        }

        fs.writeFile(guildIdPath, JSON.stringify(Guilds, null, 2), 'utf8');

        // Upload guilds to MongoDB
        uploadJson(guildIdPath, 'guildId');

        // Set bot status
        readyClient.user.setStatus('idle');
        readyClient.user.setActivity('your mom!', { type: ActivityType.PLAYING });

        // Read voice.json file
        const voicePath = path.join(__dirname, '../data/voice.json');
        let voiceData;
        try {
            // Check if voice.json exists
            await fs.access(voicePath);
            voiceData = JSON.parse(await fs.readFile(voicePath, 'utf8'));
        } catch (err) {
            // If voice.json doesn't exist, create an empty one
            if (err.code === 'ENOENT') {
                console.log("Creating voice.json...");
                await fs.writeFile(voicePath, '{}');
                voiceData = {};

            } else {
                console.error("Error:", err);
                return; // Stop execution if there's an error
            }
        }

        // Join voice channel
        const guildListPath = path.join(__dirname, '../data/guildId.json');
        const guildList = JSON.parse(await fs.readFile(guildListPath, 'utf8'));
        for (const guild of guildList) {
            console.log(guild);
            if (voiceData[guild] !== undefined) {
                console.log(voiceData[guild]);
                try {
                    // get the guild
                    vGuild = readyClient.guilds.cache.get(guild);
                    voiceconnection = joinVoiceChannel({
                        channelId: voiceData[guild],
                        guildId: guild,
                        adapterCreator: vGuild.voiceAdapterCreator
                    });
                }
                catch (error) {
                    console.error(error);
                 }
            }
        }
    }
};
