// server/routes/datasets.js
const router = require('express').Router();
const data   = require('../data');

router.get('/', (req, res) => {
  let list = data.datasets || [];
  const { region, year, researchArea, format } = req.query;
  if (region)       list = list.filter(d => d.region.toLowerCase() === region.toLowerCase());
  if (year)         list = list.filter(d => String(d.year) === String(year));
  if (researchArea) list = list.filter(d => d.researchArea.toLowerCase().includes(researchArea.toLowerCase()));
  if (format)       list = list.filter(d => d.format.toLowerCase() === format.toLowerCase());
  res.json(list);
});

router.get('/:id', (req, res) => {
  const item = (data.datasets || []).find(d => String(d.id) === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

module.exports = router;
