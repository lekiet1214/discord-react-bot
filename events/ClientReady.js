const { Events } = require('discord.js');

if (process.env.userIdList) {
    userIdList = process.env.userIdList.split(',');
}

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(readyClient) {
        console.log(`Ready lol!`);
    }
};