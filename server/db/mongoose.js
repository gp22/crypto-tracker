const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, (err) => {
  if (err) {
    return console.log('Failed to connect to MongoDB.');
  }

  console.log('Successfully connected to MongoDB.');
});

module.exports = { mongoose };
