require('./config/config');
const path = require('path');
const http = require('http');
const moment = require('moment');
const express = require('express');
const socketIO = require('socket.io');
const { Chart } = require('./models/chart');
const { CurrencyPair } = require('./models/currencyPair');
const { mongoose } = require('./db/mongoose');

const app = express();
const PORT = process.env.PORT;
const server = http.createServer(app);
const io = socketIO(server);

// Create link to Angular build directory
const distDir = path.join(__dirname, '/dist');
console.log(__dirname);
console.log(distDir);
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

// Setup handlers for socket events
io.on('connection', (socket) => {
  Chart.findOne({})
    .populate('currencyPairs')
    .then((foundChart) => {
      socket.emit('newChart', foundChart);
    });

  socket.on('addCurrency', (receivedCurrencyPair) => {
    const { currency1, currency2 } = receivedCurrencyPair;
    const currencyPair = {
      currencyPair: `${currency1}_${currency2}`,
    };

    CurrencyPair.findOne(currencyPair)
      .then((foundCurrencyPair) => {
        socket.broadcast.emit('addCurrency', foundCurrencyPair);
      });
  });

  socket.on('deleteCurrency', (currencyPairToDelete) => {
    socket.broadcast.emit('deleteCurrency', currencyPairToDelete);
  });

  socket.on('newChart', () => {
    Chart.findOne({})
      .populate('currencyPairs')
      .then((foundChart) => {
        socket.broadcast.emit('newChart', foundChart);
      });
  });
});

// Start the server and listen on PORT.
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});

// Export express so that it can be used by mocha for tests
module.exports = { app };
