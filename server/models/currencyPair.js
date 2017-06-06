const mongoose = require('mongoose');

const CurrencyPairSchema = new mongoose.Schema({
  currencyPair: {
    type: String,
    required: true,
    unique: true,
  },
  startDate: {
    type: Number,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
});

const CurrencyPair = mongoose.model('CurrencyPair', CurrencyPairSchema);

module.exports = { CurrencyPair };
