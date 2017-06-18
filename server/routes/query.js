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

const router = express.Router();
const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

router.use(bodyParser.json());

// Route to add currency pair to db
router.post('/api/currency', (req, res) => {
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

  // Query db to get the chart we'll be adding the currency pair to
  Chart.findOne({})
    .then((foundChart) => {
      const { startDate } = foundChart;
      const currencyPairData = { currencyPair, startDate, data: [{}] };
      const newCurrencyPair = new CurrencyPair(currencyPairData);

      newCurrencyPair.save()
        .then((savedCurrencyPair) => {
          savedCurrencyPair.getChartData(startDate)
            .then(() => {
              CurrencyPair.findOne({ currencyPair })
                .then((finalCurrencyPair) => {
                  foundChart.addCurrencyPair(finalCurrencyPair)
                    .then(() => res.status(200).send(finalCurrencyPair))
                    .catch(() => res.status(500).send());
                });
            })
            .catch(() => res.status(500).send());
        })
        .catch(error => res.status(400).json(error.errmsg));
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
