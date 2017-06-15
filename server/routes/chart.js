/*
CHART Routes
*/
const { CurrencyPair } = require('./../models/currencyPair');
const bodyParser = require('body-parser');
const validator = require('validator');
const express = require('express');

const router = express.Router();

router.use(bodyParser.json());

router.patch('/api/chart', (req, res) => {
  const { newStartDate } = req.body;
  const currencyUpdates = [];

  if (!newStartDate) {
    return res.status(400).send();
  }

  if (!validator.isNumeric(newStartDate)) {
    return res.status(400).send();
  }

  CurrencyPair.find({})
    .then((foundCurrencyPairs) => {
      foundCurrencyPairs.forEach((currencyPair) => {
        currencyUpdates.push(new Promise((resolve, reject) => {
          currencyPair.modifyDateRange(newStartDate)
            .then(() => resolve())
            .catch(error => reject(error));
        }));
      });

      Promise.all(currencyUpdates)
        .then(() => {
          res.status(200).send();
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    })
    .catch(() => res.status(500).send());
});

module.exports = router;
