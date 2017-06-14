const mongoose = require('mongoose');
const axios = require('axios');

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

CurrencyPairSchema.methods.modifyDateRange = function (newStartDate) {
  const currency1 = this.currencyPair.split('_')[0];
  const currency2 = this.currencyPair.split('_')[1];
  const poloniexUrl = `https://poloniex.com/public?command=returnChartData&currencyPair=${currency1}_${currency2}&start=${newStartDate}&end=9999999999&period=86400`;

  return axios.get(poloniexUrl)
    .then((poloniexData) => {
      const updatedData = poloniexData.data;

      return this.update({
        data: updatedData,
      });
    })
    .catch(() => {
      return Promise.reject('There was a problem getting chart data');
    });
};

const CurrencyPair = mongoose.model('CurrencyPair', CurrencyPairSchema);

module.exports = { CurrencyPair };
