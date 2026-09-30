// server/routes/publications.js
const router = require('express').Router();
const data   = require('../data');

router.get('/', (req, res) => {
  let list = data.publications || [];
  const { year, researchArea, region } = req.query;
  if (year)         list = list.filter(p => String(p.year) === String(year));
  if (researchArea) list = list.filter(p => p.researchArea.toLowerCase().includes(researchArea.toLowerCase()));
  if (region)       list = list.filter(p => p.region.toLowerCase() === region.toLowerCase());
  res.json(list);
});

router.get('/:id', (req, res) => {
  const item = (data.publications || []).find(p => String(p.id) === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

module.exports = router;
