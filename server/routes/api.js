// server/routes/api.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Load demo data (single JSON file) – in real app replace with DB
const dataPath = path.join(__dirname, '..', '..', 'src', 'data', 'demo.json');
let demoData = {};
try {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  demoData = JSON.parse(raw);
} catch (e) {
  console.error('Failed to load demo data', e);
}

// Helper to get collection
const getCollection = (name) => demoData[name] || [];

// Generic list endpoint: /api/:entity
router.get('/:entity', (req, res) => {
  const { entity } = req.params;
  const collection = getCollection(entity);
  if (!collection.length) {
    return res.status(404).json({ error: 'Entity not found' });
  }
  res.json(collection);
});

// Generic detail endpoint: /api/:entity/:id
router.get('/:entity/:id', (req, res) => {
  const { entity, id } = req.params;
  const collection = getCollection(entity);
  const item = collection.find((i) => String(i.id) === id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(item);
});

module.exports = router;
