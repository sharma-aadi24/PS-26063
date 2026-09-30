// server/routes/articles.js
const router = require('express').Router();
const data   = require('../data');

router.get('/', (req, res) => {
  let list = data.articles || [];
  const { category, region } = req.query;
  if (category) list = list.filter(a => a.category.toLowerCase() === category.toLowerCase());
  if (region)   list = list.filter(a => a.region.toLowerCase() === region.toLowerCase());
  res.json(list);
});

router.get('/:id', (req, res) => {
  const item = (data.articles || []).find(a => String(a.id) === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

module.exports = router;
