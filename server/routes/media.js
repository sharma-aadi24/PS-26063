// server/routes/media.js
const router = require('express').Router();
const data   = require('../data');

router.get('/', (req, res) => {
  let list = data.media || [];
  const { type, expeditionId } = req.query;
  if (type)         list = list.filter(m => m.type === type);
  if (expeditionId) list = list.filter(m => String(m.expeditionId) === String(expeditionId));
  res.json(list);
});

router.get('/:id', (req, res) => {
  const item = (data.media || []).find(m => String(m.id) === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

module.exports = router;
