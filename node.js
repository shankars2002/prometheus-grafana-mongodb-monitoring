const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://Shankar:Shankar12345@cluster0.xjzyw.mongodb.net/test'; // Replace with your connection string
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");

        const database = client.db('test'); // Replace with your database name
        const collection = database.collection('users'); // Replace with your collection name

        // Example: Inserting a document
        await collection.insertOne({ name: 'Alice', age: 25 });
        console.log("Document inserted");

        // Example: Finding all documents
        const users = await collection.find().toArray();
        console.log(users);
    } finally {
        await client.close();
    }
}

run().catch(console.error);
