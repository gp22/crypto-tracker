/*
CHART Routes
*/
const { CurrencyPair } = require('./../models/currencyPair');
const { Chart } = require('./../models/chart');
const bodyParser = require('body-parser');
const validator = require('validator');
const express = require('express');

const router = express.Router();

router.use(bodyParser.json());

// Route to update the date range of the chart
router.patch('/api/chart', (req, res) => {
  let { newStartDate } = req.body;
  newStartDate = newStartDate.toString();
  const currencyUpdates = [];

  if (!newStartDate || !validator.isNumeric(newStartDate)) {
    return res.status(400).send();
  }

  CurrencyPair.find({})
    .then((foundCurrencyPairs) => {
      if (foundCurrencyPairs.length === 0) {
        return res.status(404).send();
      }

      foundCurrencyPairs.forEach((currencyPair) => {
        currencyUpdates.push(new Promise((resolve, reject) => {
          currencyPair.modifyDateRange(newStartDate)
            .then(() => resolve())
            .catch(error => reject(error));
        }));
      });

      Promise.all(currencyUpdates)
        .then(() => {
          Chart.findOne({})
            .populate('currencyPairs')
            .then((foundChart) => {
              foundChart.updateDateRange(newStartDate)
                .then(() => res.status(200).send(foundChart));
            });
        })
        .catch(() => res.status(500).send());
    })
    .catch(() => res.status(500).send());
});

module.exports = router;
