const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

const uri = 'mongodb+srv://Shankar:Shankar12345@cluster0.xjzyw.mongodb.net/test'; // Replace with your connection string
const client = new MongoClient(uri);

app.post('/users', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('test');
        const collection = database.collection('users');
        const result = await collection.insertOne(req.body);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send(error);
    } finally {
        await client.close();
    }
});

app.get('/users', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('test');
        const collection = database.collection('users');
        const users = await collection.find().toArray();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    } finally {
        await client.close();
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
