const MongoClient = require('mongodb').MongoClient;
const config = require('./config')

const url = `mongodb://${config.mongo.host}:${config.mongo.prot}`;
const client = new MongoClient(url, {useUnifiedTopology: true});

let mongoClient = null;

const getClient = async function() {
    if (mongoClient == null) {
        mongoClient = await client.connect();
    }
    return mongoClient;
}

const closeClient = async function() {
    if (mongoClient != null) {
        await client.close();
        mongoClient = null;
    }
}

module.exports = {
    getClient,
    closeClient,
}

