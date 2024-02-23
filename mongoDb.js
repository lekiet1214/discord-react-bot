const fs = require('fs');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

async function getJSONFromMongoDB(collectionName) {
    try {
        const client = new MongoClient(process.env.MONGODB_URI, {});
        await client.connect();
        const db = client.db();
        const collection = db.collection(collectionName);
        const jsonDoc = await collection.findOne();
        client.close();
        return jsonDoc ? jsonDoc.data : null;
    } catch (error) {
        console.error("Error fetching JSON data from MongoDB:", error);
        throw error;
    }
}

function updateJSON(pathToJson, newData) {
    try {
        // create the data directory if it doesn't exist
        const dataDir = pathToJson.substring(0, pathToJson.lastIndexOf('/'));
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        // create the JSON file if it doesn't exist
        if (!fs.existsSync(pathToJson)) { 
            fs.writeFileSync(pathToJson, JSON.stringify([], null, 2)); 
        }
        // Write the new data to the JSON file
        fs.writeFileSync(pathToJson, JSON.stringify(newData, null, 2), 'utf8');
        console.debug(`JSON file '${pathToJson}' updated successfully`);
    } catch (error) {
        console.error(`Error updating JSON file '${pathToJson}':`, error);
        throw error;
    }
}

async function updateJSONWithMongoData(pathToJson, collectionName) {
    try {
        const mongoData = await getJSONFromMongoDB(collectionName);
        if (mongoData) {
            updateJSON(pathToJson, mongoData);
        } else {
            console.debug(`No JSON data found in MongoDB for collection '${collectionName}'`);
        }
    } catch (error) {
        console.error(`Error updating JSON file '${pathToJson}' with MongoDB data:`, error);
        throw error;
    }
}

async function uploadJson(pathToJson, collectionName) {
    try {
        const fileData = fs.readFileSync(pathToJson, 'utf8');
        const jsonData = JSON.parse(fileData);
        const client = new MongoClient(process.env.MONGODB_URI, {});
        await client.connect();
        const db = client.db();
        const collection = db.collection(collectionName);
        await collection.replaceOne({}, { data: jsonData }, { upsert: true });
        console.debug(`JSON file '${pathToJson}' uploaded successfully to MongoDB`);
        client.close();
    } catch (error) {
        console.error(`Error uploading JSON file '${pathToJson}' to MongoDB:`, error);
        throw error;
    }
}

module.exports = { updateJSONWithMongoData, uploadJson };

const args = process.argv.slice(2);
if (args.length > 0) {
    if (args[0] === 'update') {
        updateJSONWithMongoData('data/reactData.json', 'reactData');
        updateJSONWithMongoData('data/commands.json', 'commands');
        updateJSONWithMongoData('data/guildId.json', 'guildId');
        updateJSONWithMongoData('data/voice.json', 'voice');
    } else if (args[0] === 'upload') {
        uploadJson('data/voice.json', 'voice');
        uploadJson('data/reactData.json', 'reactData');
        uploadJson('data/commands.json', 'commands');
        uploadJson('data/guildId.json', 'guildId');
    }
}