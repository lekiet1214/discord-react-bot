const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { updateJSONWithMongoData, uploadJson } = require('./mongoDb');

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
        fs.writeFileSync(guildIdPath, JSON.stringify(Guilds, null, 2));
        // Upload guilds to MongoDB
        uploadJson(guildIdPath, 'guildId');
        

        

    }
};