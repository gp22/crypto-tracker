/*
QUERY Route
Query string format (start needs to be a valid UNIX timestamp):
/api/?currency1=BTC&currency2=USDT&start=1488184924
Trading pairs on Poloniex (values for currency1 and currency2):
http://www.cryptocoincharts.info/markets/show/poloniex
*/
const validator = require('validator');
const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/api/', (req, res) => {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const { currency1, currency2, start } = req.query;

  if (!validator.isWhitelisted(currency1, upper) ||
      !validator.isWhitelisted(currency2, upper) ||
      !validator.isNumeric(start)) {
    return res.status(400).send();
  }
  const poloniexUrl = `https://poloniex.com/public?command=returnChartData&currencyPair=${currency2}_${currency1}&start=${start}&end=9999999999&period=86400`;

  axios.get(poloniexUrl).then((poloniexData) => {
    const clientResponse = poloniexData.data;
    res.status(200).send(clientResponse);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

module.exports = router;
