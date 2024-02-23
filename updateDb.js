const { updateJSONWithMongoData, uploadJson } = require('./mongoDb');

async function updateDb() {
    updateJSONWithMongoData('data/reactData.json', 'reactData');
    updateJSONWithMongoData('data/commands.json', 'commands');
    updateJSONWithMongoData('data/guildId.json', 'guildId');
    updateJSONWithMongoData('data/voice.json', 'voice');
}

async function uploadDb() {
    uploadJson('data/reactData.json', 'reactData');
    uploadJson('data/commands.json', 'commands');
    uploadJson('data/guildId.json', 'guildId');
    uploadJson('data/voice.json', 'voice');

}

updateDb();

setTimeout(() => {
    // Code to execute after 5 seconds
    console.log('"');
}, 5000);


setInterval(updateDb, 300000);
setInterval(uploadDb, 300000);