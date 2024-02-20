const { updateJSONWithMongoData, uploadJson } = require('./mongoDb');

async function updateDb() {
    updateJSONWithMongoData('data/reactData.json', 'reactData');
    updateJSONWithMongoData('data/commands.json', 'commands');
    updateJSONWithMongoData('data/guildId.json', 'guildId');
}

async function uploadDb() {
    uploadJson('data/reactData.json', 'reactData');
    uploadJson('data/commands.json', 'commands');
    uploadJson('data/guildId.json', 'guildId');

}

// Run with interval of 5 minutes
setInterval(updateDb, 300000);
setInterval(uploadDb, 300000);