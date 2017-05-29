require('./config/config');
const path = require('path');

const express = require('express');

const { mongoose } = require('./db/mongoose');

const app = express();
const PORT = process.env.PORT;

// Create link to Angular build directory
const distDir = path.join(__dirname, '../dist');
app.use(express.static(distDir));

// Import routes
// const index = require('./routes/index');
// const query = require('./routes/query');
// const event = require('./routes/event');
// const auth = require('./routes/auth');
// const def = require('./routes/default');

// Setup express to use routes
// app.use(index);
// app.use(query);
// app.use(event);
// app.use(auth);
// app.use(def);

// Start the server and listen on PORT.
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});

// Export express so that it can be used by mocha for tests
module.exports = { app };
