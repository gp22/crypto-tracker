const mongoose = require('mongoose');

const ChartSchema = new mongoose.Schema({
  currencyPairs: [{
    type: Object,
    uniqe: false,
  }],
});

ChartSchema.methods.addCurrencyPair = function () {

};

const Chart = mongoose.model('Chart', ChartSchema);

module.exports = { Chart };
