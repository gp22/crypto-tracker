/*
CURRENCY Routes
Trading pairs on Poloniex (values for currency1 and currency2):
http://www.cryptocoincharts.info/markets/show/poloniex
*/
const { CurrencyPair } = require('./../models/currencyPair');
const { Chart } = require('./../models/chart');
const bodyParser = require('body-parser');
const validator = require('validator');
const express = require('express');
const axios = require('axios');

const router = express.Router();
const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

router.use(bodyParser.json());

// Route to add currency pair to db
router.post('/api/currency', (req, res) => {
  const { currency1, currency2 } = req.body;

  if (!currency1 || !currency2) {
    return res.status(400).send();
  }

  if (!validator.isWhitelisted(currency1, upper) ||
      validator.isEmpty(currency1) ||
      !validator.isWhitelisted(currency2, upper) ||
      validator.isEmpty(currency2)) {
    return res.status(400).send();
  }

  // Query db to get the chart we'll be adding the currency pair to
  Chart.findOne({})
    .then((foundChart) => {
      const { startDate } = foundChart;
      const poloniexUrl = `https://poloniex.com/public?command=returnChartData&currencyPair=${currency1}_${currency2}&start=${startDate}&end=9999999999&period=86400`;

      axios.get(poloniexUrl)
        .then((poloniexData) => {
          const currencyPairData = {
            currencyPair: `${currency1}_${currency2}`,
            startDate,
            data: poloniexData.data,
          };
          const newCurrencyPair = new CurrencyPair(currencyPairData);

          newCurrencyPair.save()
            .then((savedCurrencyPair) => {
              foundChart.addCurrencyPair(savedCurrencyPair)
                .then(() => res.status(200).send(savedCurrencyPair));
            })
            .catch(error => res.status(400).send(error.errmsg));
        })
        .catch(() => res.status(500).json('There was a problem getting chart data'));
    })
    .catch(() => res.status(500).send());
});

// Route to delete currency pair from db
router.delete('/api/currency', (req, res) => {
  const { currency1, currency2 } = req.body;
  const currencyPair = `${currency1}_${currency2}`;

  if (!currency1 || !currency2) {
    return res.status(400).send();
  }

  if (!validator.isWhitelisted(currency1, upper) ||
      validator.isEmpty(currency1) ||
      !validator.isWhitelisted(currency2, upper) ||
      validator.isEmpty(currency2)) {
    return res.status(400).send();
  }

  CurrencyPair.findOneAndRemove({ currencyPair })
    .then((removedCurrencyPair) => {
      if (!removedCurrencyPair) {
        return res.status(404).send();
      }

      Chart.findOne({})
        .then((foundChart) => {
          foundChart.removeCurrencyPair(removedCurrencyPair)
            .then(() => res.status(200).send());
        });
    })
    .catch(error => res.status(400).send(error));
});

module.exports = router;
