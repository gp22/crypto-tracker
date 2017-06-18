const mongoose = require('mongoose');

const ChartSchema = new mongoose.Schema({
  startDate: {
    type: Number,
    required: true,
  },
  currencyPairs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CurrencyPair',
    required: true,
  }],
});

ChartSchema.methods.addCurrencyPair = function (newCurrencyPair) {
  this.currencyPairs.push(newCurrencyPair);
  return this.save();
};

ChartSchema.methods.removeCurrencyPair = function (currencyPair) {
  this.currencyPairs.pull(currencyPair);
  return this.save();
};

ChartSchema.methods.updateDateRange = function (newStartDate) {
  const startDate = newStartDate;
  return this.update({ startDate });
};

const Chart = mongoose.model('Chart', ChartSchema);

module.exports = { Chart };
