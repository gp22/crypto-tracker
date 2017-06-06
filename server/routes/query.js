/*
QUERY Route
Query string format (start needs to be a valid UNIX timestamp):
/api/?currency1=BTC&currency2=USDT&start=1488184924
Trading pairs on Poloniex (values for currency1 and currency2):
http://www.cryptocoincharts.info/markets/show/poloniex
*/
// const { CurrencyPair } = require('./../models/currencyPair');
const { Chart } = require('./../models/chart');
const { CurrencyPair } = require('./../models/currencyPair');
const bodyParser = require('body-parser');
const validator = require('validator');
const express = require('express');
const axios = require('axios');

const router = express.Router();
const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

router.use(bodyParser.json());

/*
get /api
query the db and return the chart object

post /api
argument: currency pair

delete /api
*/

// Route to get current chart data
router.get('/api', (req, res) => {
  const { currency1, currency2, start } = req.query;
  const poloniexUrl = `https://poloniex.com/public?command=returnChartData&currencyPair=${currency2}_${currency1}&start=${start}&end=9999999999&period=86400`;

  if (!validator.isWhitelisted(currency1, upper) ||
      !validator.isWhitelisted(currency2, upper) ||
      !validator.isNumeric(start)) {
    return res.status(400).send();
  }

  axios.get(poloniexUrl).then((poloniexData) => {
    const clientResponse = poloniexData.data;
    res.status(200).send(clientResponse);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

// Route to add currency pair to db
router.post('/api/currency', (req, res) => {
  const { currency1, currency2, start } = req.body;
  const poloniexUrl = `https://poloniex.com/public?command=returnChartData&currencyPair=${currency1}_${currency2}&start=${start}&end=9999999999&period=86400`;

  if (!validator.isWhitelisted(currency1, upper) ||
      !validator.isWhitelisted(currency2, upper) ||
      !validator.isNumeric(start)) {
    return res.status(400).send();
  }

  // Query db to get the chart we'll be adding the currency pair to
  Chart.findOne({}).then((foundChart) => {
    axios.get(poloniexUrl).then((poloniexData) => {
      const newCurrencyPair = {
        currencyPair: `${currency1}_${currency2}`,
        startDate: Number(start),
        data: poloniexData.data,
      };

      // Query the db to see if currency pair already exists
      CurrencyPair.findOne({ currencyPair: `${currency1}_${currency2}` })
        .then((foundCurrencyPair) => {
          if (foundCurrencyPair) {
            return res.status(400).send('Currency pair already exists');
          }
          foundChart.addCurrencyPair(newCurrencyPair).then(() => {
            res.status(200).send(newCurrencyPair);
          });
        });
    }).catch((e) => {
      res.status(400).send(e);
    });
  });
});

module.exports = router;
