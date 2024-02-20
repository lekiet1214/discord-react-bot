const fs = require('fs');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

async function getJSONFromMongoDB() {
    try {
        const client = new MongoClient(process.env.MONGODB_URI, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        await client.connect();
        const db = client.db();
        const collection = db.collection('json_collection');
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
        fs.writeFileSync(pathToJson, JSON.stringify(newData, null, 2), 'utf8');
        console.log("JSON file updated successfully");
    } catch (error) {
        console.error("Error updating JSON file:", error);
        throw error;
    }
}

async function updateJSONWithMongoData(pathToJson) {
    try {
        const mongoData = await getJSONFromMongoDB();
        if (mongoData) {
            updateJSON(pathToJson, mongoData);
        } else {
            console.log("No JSON data found in MongoDB");
        }
    } catch (error) {
        console.error("Error updating JSON file with MongoDB data:", error);
        throw error;
    }
}

async function uploadJson(pathToJson) {
    try {
        const fileData = fs.readFileSync(pathToJson, 'utf8');
        const jsonData = JSON.parse(fileData);
        const client = new MongoClient(process.env.MONGODB_URI, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        await client.connect();
        const db = client.db();
        const collection = db.collection('json_collection');
        await collection.replaceOne({}, { data: jsonData }, { upsert: true });
        console.log("JSON file uploaded successfully to MongoDB");
        client.close();
    } catch (error) {
        console.error("Error uploading JSON file to MongoDB:", error);
        throw error;
    }
}

module.exports = {
    updateJSONWithMongoData,
    uploadJson,
};