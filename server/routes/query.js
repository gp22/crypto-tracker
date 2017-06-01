/*
QUERY Route
Query string format (start needs to be a valid UNIX timestamp):
/api/?currency1=BTC&currency2=USDT&start=1488184924
Trading pairs on Poloniex (values for currency1 and currency2):
http://www.cryptocoincharts.info/markets/show/poloniex
*/
// const { CurrencyPair } = require('./../models/currencyPair');
const { Chart } = require('./../models/chart');
const validator = require('validator');
const express = require('express');
const axios = require('axios');

const router = express.Router();

const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

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
router.post('/api/currencies', (req, res) => {
  const { currency1, currency2, start } = req.query;
  const poloniexUrl = `https://poloniex.com/public?command=returnChartData&currencyPair=${currency2}_${currency1}&start=${start}&end=9999999999&period=86400`;

  if (!validator.isWhitelisted(currency1, upper) ||
      !validator.isWhitelisted(currency2, upper) ||
      !validator.isNumeric(start)) {
    return res.status(400).send();
  }

  // Query db to get the chart we'll be adding the currency pair to
  Chart.findOne({}).then((foundChart) => {
    axios.get(poloniexUrl).then((poloniexData) => {
      const newCurrencyPair = {
        currency1,
        currency2,
        data: poloniexData.data,
      };
      console.log(newCurrencyPair);

      res.status(200).send();
    }).catch((e) => {
      res.status(400).send(e);
    });
  });
});

module.exports = router;
