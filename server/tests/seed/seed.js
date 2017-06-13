const { CurrencyPair } = require('../../models/currencyPair');

// clear the database before each test
const clearCurrencyPairs = (done) => {
  CurrencyPair.remove({}).then(() => done());
};

module.exports = { clearCurrencyPairs };
