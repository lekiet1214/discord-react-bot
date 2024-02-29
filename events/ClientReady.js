const { ActivityType, Events } = require('discord.js');
const fs = require('fs'); // Use fs.promises for promise-based file operations
const path = require('path');
const { uploadJson } = require('../mongoDb');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(readyClient) {
        console.log(`Ready lol!`);
        const Guilds = readyClient.guilds.cache.map(guild => guild.id);
        // Write guilds to guildid.json
        const guildIdPath = path.join(__dirname, '../data/guildId.json');

        // Write guilds to guildid.json
        fs.writeFileSync(guildIdPath, JSON.stringify(Guilds, null, 2));
        uploadJson(guildIdPath, 'guildId');
        // Set activity
        readyClient.user.setActivity('your mom', { type: ActivityType.PLAYING });
        // Set status
        readyClient.user.setStatus('odle');

        const voiceData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/voice.json'), 'utf8'));
        if (voiceData === undefined) {
            console.error('Voice data not found');
            return;
        }

        // Join voice channel
        const guildListPath = path.join(__dirname, '../data/guildId.json');
        const guildList = JSON.parse(fs.readFileSync(guildListPath, 'utf8'));
        for (const guild of guildList) {
            if (voiceData[guild] !== undefined) {
                try {
                    // get the guild
                    vGuild = readyClient.guilds.cache.get(guild);
                    voiceConnection = joinVoiceChannel({
                        channelId: voiceData[guild],
                        guildId: guild,
                        adapterCreator: vGuild.voiceAdapterCreator,
                        selfDeaf: false,
                        selfMute: false
                    });
                    voiceConnection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
                        try {
                            await Promise.race([
                                entersState(voiceConnection, VoiceConnectionStatus.Signalling, 5_000),
                                entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5_000),
                            ]);
                            // Seems to be reconnecting to the same channel
                        }
                        catch (error) {
                            voiceConnection.destroy();
                        }
                    });
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
    }
};
