const Chart = require('chart.js');
const moment = require('moment');
const apiService = require('./apiService');

const ctx = document.getElementById('cryptoChart');
const options = {
  responsive: true,
  maintainAspectRatio: false,
};
const cryptoChart = new Chart(ctx, {
  type: 'line',
  options,
  data: {
    labels: [],
    datasets: [],
  },
});

/* ************************************************************************* */
/* ------------------------ Local Data Manipulation ------------------------ */
/* ************************************************************************* */

function createCurrencyPairDataset(currencyPair) {
  const data = currencyPair.data.map(currencyData => currencyData.high);
  const label = currencyPair.currencyPair;
  const dataSet = {
    label,
    data,
    borderWidth: 1,
    fill: false,
  };
  return dataSet;
}

function addChartData(currencyPair, dataSets) {
  // Create the date labels for the chart if they don't exist
  if (cryptoChart.data.labels.length === 0) {
    currencyPair.data.forEach((data) => {
      const date = (moment.unix(data.date).format('YYYY.MM.DD'));
      cryptoChart.data.labels.push(date);
    });
  }

  dataSets.forEach((dataSet) => {
    cryptoChart.data.datasets.push(dataSet);
  });

  cryptoChart.update();
}

function removeChartData(currencyPair) {
  const currencyPairToDelete = `${currencyPair.currency1}_${currencyPair.currency2}`;
  const index = (cryptoChart.data.datasets.findIndex((dataset) => {
    return dataset.label === currencyPairToDelete;
  }));

  cryptoChart.data.datasets.splice(index, 1);
  cryptoChart.update();
}

function clearChart() {
  cryptoChart.data.labels.length = 0;
  cryptoChart.data.datasets.length = 0;
  cryptoChart.update();
}

function createNewChart(chartData) {
  const firstCurrencyPair = chartData.currencyPairs[0];
  const dataSets = [];

  if (chartData.currencyPairs.length === 0) {
    return;
  }

  clearChart();

  // Popluate chart data for each currencyPair and push into datasets
  chartData.currencyPairs.forEach((currencyPair) => {
    const dataSet = createCurrencyPairDataset(currencyPair);
    dataSets.push(dataSet);
  });

  addChartData(firstCurrencyPair, dataSets);
}

/* ************************************************************************* */
/* ------------------------------- API Calls ------------------------------- */
/* ************************************************************************* */

function addCurrencyPair(currencyPair) {
  return new Promise((resolve) => {
    apiService.getNewCurrencyFromAPI(currencyPair)
      .then((responseData) => {
        const dataSet = createCurrencyPairDataset(responseData);
        addChartData(responseData, [dataSet]);
        resolve();
      })
      .catch(e => e.message);
  });
}

function removeCurrencyPair(currencyPair) {
  return new Promise((resolve) => {
    apiService.removeCurrencyFromAPI(currencyPair)
      .then(() => {
        removeChartData(currencyPair);
        resolve();
      })
      .catch(e => e.message);
  });
}

function updateDateRange(newDateRange) {
  const timeStamp = moment().subtract(newDateRange, 'days').unix();
  const newStartDate = {
    newStartDate: timeStamp,
  };

  return new Promise((resolve) => {
    apiService.updateDateRangeFromAPI(newStartDate)
      .then((newChartData) => {
        createNewChart(newChartData);
        resolve();
      })
      .catch(e => e.message);
  });
}

module.exports = {
  createCurrencyPairDataset,
  addChartData,
  removeChartData,
  addCurrencyPair,
  removeCurrencyPair,
  createNewChart,
  updateDateRange,
};
