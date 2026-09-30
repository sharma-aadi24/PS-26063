// server/data.js  — shared data loader
const path = require('path');
const fs   = require('fs');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'demo.json');
let data = {};
try {
  data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
} catch(e) { console.error('demo.json load failed', e); }

module.exports = data;
