const { Events, Message } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute(Message) {
        if (Message.author.bot) return;

        // read reactData.json in data folder
        
        const reactDataPath = path.join(__dirname, '..', 'data', 'reactData.json');
        let reactData = {};
        if (fs.existsSync(reactDataPath)) {
            console.log('reactData.json exists')
            reactData = JSON.parse(fs.readFileSync(reactDataPath));
        }

        console.log(JSON.stringify(Message, null, 2));
        // Search if userId is in reactData
        if (Message.author.id in reactData) {
            // Search if message is in reactData[userId]
            if (Message.guildId in reactData[Message.author.id]) {
                // React to message
                Message.react(reactData[Message.author.id][Message.guildId]);
            }
        }
        return;
    }
};