// server/routes/expeditions.js
const router = require('express').Router();
const data   = require('../data');

router.get('/', (req, res) => {
  let list = data.expeditions || [];
  const { region, year } = req.query;
  if (region) list = list.filter(e => e.region.toLowerCase() === region.toLowerCase());
  if (year)   list = list.filter(e => String(e.year) === String(year));
  res.json(list);
});

router.get('/:id', (req, res) => {
  const item = (data.expeditions || []).find(e => String(e.id) === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

module.exports = router;
