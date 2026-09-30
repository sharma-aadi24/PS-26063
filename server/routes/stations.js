// server/routes/stations.js
const router = require('express').Router();
const data   = require('../data');

router.get('/', (_req, res) => res.json(data.stations || []));

router.get('/:id', (req, res) => {
  const item = (data.stations || []).find(s => String(s.id) === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

module.exports = router;
