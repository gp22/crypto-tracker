const mongoose = require('mongoose');
const axios = require('axios');

const CurrencyPairSchema = new mongoose.Schema({
  currencyPair: {
    type: String,
    required: true,
    unique: true,
  },
  data: {
    type: Array,
    required: true,
  },
});

CurrencyPairSchema.methods.getChartData = function (startDate) {
  const currency1 = this.currencyPair.split('_')[0];
  const currency2 = this.currencyPair.split('_')[1];
  const poloniexUrl = `https://poloniex.com/public?command=returnChartData&currencyPair=${currency1}_${currency2}&start=${startDate}&end=9999999999&period=86400`;

  return axios.get(poloniexUrl)
    .then((poloniexData) => {
      const { data } = poloniexData;

      return this.update({ data });
    });
};

CurrencyPairSchema.methods.modifyDateRange = function (newStartDate) {
  const currency1 = this.currencyPair.split('_')[0];
  const currency2 = this.currencyPair.split('_')[1];
  const poloniexUrl = `https://poloniex.com/public?command=returnChartData&currencyPair=${currency1}_${currency2}&start=${newStartDate}&end=9999999999&period=86400`;

  return axios.get(poloniexUrl)
    .then((poloniexData) => {
      const { data } = poloniexData;

      return this.update({ data });
    });
};

const CurrencyPair = mongoose.model('CurrencyPair', CurrencyPairSchema);

module.exports = { CurrencyPair };
