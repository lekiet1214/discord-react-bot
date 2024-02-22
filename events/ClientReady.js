const { ActivityType, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { uploadJson } = require('../mongoDb');

if (process.env.userIdList) {
    userIdList = process.env.userIdList.split(',');
}

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(readyClient) {
        console.log(`Ready lol!`);
        const Guilds = readyClient.guilds.cache.map(guild => guild.id);
        // Write guilds to guildid.json
        const guildIdPath = path.join(__dirname, '../data/guildId.json');
        // create the data directory if it doesn't exist
        const dataDir = guildIdPath.substring(0, guildIdPath.lastIndexOf('/'));
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        // Create guildId.json if it doesn't exist
        if (!fs.existsSync(guildIdPath)) {
            fs.writeFileSync(guildIdPath, JSON.stringify([], null, 2));
        }
        // Write guilds to guildId.json        
        fs.writeFileSync(guildIdPath, JSON.stringify(Guilds, null, 2));
        // Upload guilds to MongoDB
        uploadJson(guildIdPath, 'guildId');

        // Set bot status
        readyClient.user.setStatus('idle');
        readyClient.user.setActivity('your mom!', { type: ActivityType.PLAYING });
    }
};