// server/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Load routes
app.use('/api/expeditions', require('./routes/expeditions'));
app.use('/api/stations', require('./routes/stations'));
app.use('/api/datasets', require('./routes/datasets'));
app.use('/api/publications', require('./routes/publications'));
app.use('/api/media', require('./routes/media'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/outreach', require('./routes/outreach'));
app.use('/api/search', require('./routes/search'));
app.use('/api/stats', require('./routes/stats'));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 POLARIS API running on port ${PORT}`);
});