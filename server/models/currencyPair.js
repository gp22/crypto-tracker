const mongoose = require('mongoose');

const CurrencyPairSchema = new mongoose.Schema({
  currencyPair: {
    type: String,
    required: true,
    uniqe: true,
  },
  startDate: {
    type: Number,
    required: true,
    unique: false,
  },
  data: [{
    type: Object,
    uniqe: false,
  }],
});

const CurrencyPair = mongoose.model('CurrencyPair', CurrencyPairSchema);

module.exports = { CurrencyPair };
