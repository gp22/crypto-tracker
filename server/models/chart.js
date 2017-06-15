const mongoose = require('mongoose');

const ChartSchema = new mongoose.Schema({
  startDate: {
    type: Number,
    required: true,
  },
  currencyPairs: [{
    currencyPair: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  }],
});

ChartSchema.methods.addCurrencyPair = function (newCurrencyPair) {
  this.currencyPairs.push(newCurrencyPair);
  return this.save();
};

const Chart = mongoose.model('Chart', ChartSchema);

module.exports = { Chart };
