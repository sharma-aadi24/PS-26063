// server/routes/search.js
const router = require('express').Router();
const data   = require('../data');

const matches = (obj, q) =>
  JSON.stringify(obj).toLowerCase().includes(q.toLowerCase());

router.get('/', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ expeditions:[], datasets:[], publications:[], media:[], articles:[], stations:[] });
  res.json({
    expeditions:  (data.expeditions  || []).filter(i => matches(i, q)),
    datasets:     (data.datasets     || []).filter(i => matches(i, q)),
    publications: (data.publications || []).filter(i => matches(i, q)),
    media:        (data.media        || []).filter(i => matches(i, q)),
    articles:     (data.articles     || []).filter(i => matches(i, q)),
    stations:     (data.stations     || []).filter(i => matches(i, q)),
  });
});

module.exports = router;
