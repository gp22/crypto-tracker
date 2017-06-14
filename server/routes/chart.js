/*
CHART Routes
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

router.patch('/api/chart', (req, res) => {
  const { start } = req.body;
  const allCurrencyPairUpdates = [];

  CurrencyPair.find({})
    .then((foundCurrencyPairs) => {
      foundCurrencyPairs.forEach((currencyPair) => {
        allCurrencyPairUpdates.push(new Promise((resolve) => {
          return currencyPair.modifyDateRange(start)
            .then(() => {
              resolve();
            })
            .catch((error) => {
              return res.status(400).json(error);
            });
        }));
      });

      Promise.all(allCurrencyPairUpdates)
        .then(() => {
          res.status(200).send();
        });
    })
    .catch(() => {
      res.status(400).json('Internal server error');
    });
});

module.exports = router;
