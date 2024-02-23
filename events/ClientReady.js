const { ActivityType, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { uploadJson } = require('../mongoDb');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(readyClient) {
        console.log(`Ready lol!`);
        const Guilds = readyClient.guilds.cache.map(guild => guild.id);
        // Write guilds to guildid.json
        const guildIdPath = path.join(__dirname, '../data/guildId.json');
        // Write guilds to guildId.json        
        fs.open(guildIdPath, 'w', (err, fd) => {});
        
        fs.writeFileSync(guildIdPath, JSON.stringify([], null, 2));
        fs.writeFileSync(guildIdPath, JSON.stringify(Guilds, null, 2));
        // Upload guilds to MongoDB
        uploadJson(guildIdPath, 'guildId');

        // Set bot status
        readyClient.user.setStatus('idle');
        readyClient.user.setActivity('your mom!', { type: ActivityType.PLAYING });

        // Join voice channel
        const voicePath = path.join(__dirname, '../data/voice.json');
        const voiceData = JSON.parse(fs.readFileSync(voicePath, 'utf8'));
        const { channelId, guildId } = voiceData;
        const guildListPath = path.join(__dirname, '../data/guildId.json');
        const guildList = JSON.parse(fs.readFileSync(guildListPath, 'utf8'));
        for (const guild of guildList) {
            if (guild === guildId) {
                connection = joinVoiceChannel({
                    channelId: channelId,
                    guildId: guildId,
                    adapterCreator: readyClient.guilds.cache.get(guildId).voiceAdapterCreator
                });
                
            }
        }
    }
};