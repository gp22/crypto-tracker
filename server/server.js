require('./config/config');
const path = require('path');
const express = require('express');
const { mongoose } = require('./db/mongoose');
// const Poloniex = require('poloniex-api-node');

// const POLONIEX_API_KEY = process.env.POLONIEX_API_KEY;
// const POLONIEX_API_SECRET = process.env.POLONIEX_API_SECRET;
// const poloniex = new Poloniex(POLONIEX_API_KEY, POLONIEX_API_SECRET);
// const poloniex = new Poloniex();
const app = express();
const PORT = process.env.PORT;

// Create link to Angular build directory
const distDir = path.join(__dirname, '../dist');
app.use(express.static(distDir));

// Import routes
// const index = require('./routes/index');
const query = require('./routes/query');
// const def = require('./routes/default');

// Setup express to use routes
// app.use(index);
app.use(query);
// app.use(def);

// Start the server and listen on PORT.
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});

// Export express so that it can be used by mocha for tests
module.exports = { app };
