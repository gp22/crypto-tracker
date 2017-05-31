const express = require('express');
const path = require('path');

const router = express.Router();

// HOME route
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

module.exports = router;
