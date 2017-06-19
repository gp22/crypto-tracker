require('./config/config');
const path = require('path');
const http = require('http');
const moment = require('moment');
const express = require('express');
const socket = require('socket.io');
const { mongoose } = require('./db/mongoose');
const { Chart } = require('./models/chart');

const app = express();
const PORT = process.env.PORT;
const server = http.createServer(app);
const io = socket(server);

// Create link to Angular build directory
const distDir = path.join(__dirname, '../dist');
app.use(express.static(distDir));

// Import routes
const index = require('./routes/index');
const query = require('./routes/query');
const chart = require('./routes/chart');
// const def = require('./routes/default');

// Setup express to use routes
app.use(index);
app.use(query);
app.use(chart);
// app.use(def);

// Create a new chart
Chart.findOne({}).then((foundChart) => {
  if (!foundChart) {
    const startDate = moment().subtract(7, 'days').format('X');
    const newChart = new Chart({ startDate });

    newChart.save()
      .then(() => console.log('New chart successfully created'))
      .catch(error => console.log(`There was a problem creating chart: ${Object.keys(error.errors)}`));
  }
});

io.on('connection', (socket) => {
  console.log('new user connected');
});

// Start the server and listen on PORT.
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});

// Export express so that it can be used by mocha for tests
module.exports = { app };
