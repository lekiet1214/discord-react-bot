const { updateJSONWithMongoData, uploadJson } = require('./mongoDb');

async function updateDb() {
    updateJSONWithMongoData('data/reactData.json');
}

async function uploadDb() {
    uploadJson('data/reactData.json');
}

// Run with interval of 5 minutes
setInterval(updateDb, 300000);
setInterval(uploadDb, 300000);
