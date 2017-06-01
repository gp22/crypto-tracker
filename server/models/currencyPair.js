const mongoose = require('mongoose');

const CurrencyPairSchema = new mongoose.Schema({
  pair: {
    type: String,
    required: true,
    uniqe: true,
  },
  data: [{
    type: Object,
    uniqe: false,
  }],
});

const CurrencyPair = mongoose.model('CurrencyPair', CurrencyPairSchema);

module.exports = { CurrencyPair };
