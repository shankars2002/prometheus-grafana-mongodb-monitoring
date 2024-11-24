const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// MongoDB schema setup
const nodeSchema = new mongoose.Schema({
  type: String,
  name: String,
});

const edgeSchema = new mongoose.Schema({
  type: String,
  source: String,
  destination: String,
});

const Node = mongoose.model('Node', nodeSchema);
const Edge = mongoose.model('Edge', edgeSchema);

// Endpoints
app.post('/node', async (req, res) => {
  const node = new Node(req.body);
  await node.save();
  res.status(201).send(node);
});

app.post('/edge', async (req, res) => {
  const edge = new Edge(req.body);
  await edge.save();
  res.status(201).send(edge);
});

mongoose.connect('mongodb://mongo:27017/treasurebook', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(3000, () => console.log('TreasureBook API is running on port 3000'));
