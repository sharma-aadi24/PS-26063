// server/routes/outreach.js
const router = require('express').Router();
const data   = require('../data');

// In-memory store (seeded from demo)
let items = [...(data.outreach || [])];
let nextId = items.length + 1;

router.get('/',    (_req, res) => res.json(items));

router.post('/', (req, res) => {
  const item = { id: nextId++, status: 'draft', ...req.body };
  items.push(item);
  res.status(201).json(item);
});

router.put('/:id/status', (req, res) => {
  const item = items.find(i => String(i.id) === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  item.status = req.body.status;
  res.json(item);
});

module.exports = router;
