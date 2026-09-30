// server/routes/stats.js
const router = require('express').Router();
const data   = require('../data');

router.get('/', (_req, res) => {
  res.json({
    totalExpeditions:  (data.expeditions  || []).length,
    totalDatasets:     (data.datasets     || []).length,
    totalPublications: (data.publications || []).length,
    totalMedia:        (data.media        || []).length,
    totalArticles:     (data.articles     || []).length,
    totalStations:     (data.stations     || []).length,
  });
});

module.exports = router;
