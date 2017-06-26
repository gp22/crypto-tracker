import '../css/main.scss';

const io = require('socket.io-client');
const dataService = require('./dataService');

const socket = io();
const currencyButtons = document.querySelectorAll('.currency-button');

currencyButtons.forEach((button) => {
  button.addEventListener('click', function () {
    const currency1 = 'USDT';
    const currency2 = this.id.toUpperCase();
    const currencyPair = { currency1, currency2 };

    dataService.addCurrencyPair(currencyPair);
  });
});

socket.on('newChart', (chartData) => {
  const firstCurrencyPair = chartData.currencyPairs[0];
  const datasets = [];

  if (chartData.currencyPairs.length === 0) {
    return;
  }

  dataService.clearChart();

  // Popluate chart data for each currencyPair and push into datasets
  chartData.currencyPairs.forEach((currencyPair) => {
    const dataSet = dataService.createCurrencyPairDataset(currencyPair);
    datasets.push(dataSet);
  });

  dataService.addChartData(firstCurrencyPair, datasets);
});

socket.on('addCurrency', (newCurrencyPair) => {
  const dataSet = dataService.createCurrencyPairDataset(newCurrencyPair);
  dataService.addChartData(null, dataSet);
});

socket.on('deleteCurrency', (currencyPairToDelete) => {
  // this.dataService.deleteCurrencyPair(currencyPairToDelete);
});

socket.on('updateDateRange', (updatedChartData) => {
  // this.dataService.updateChart(updatedChartData);
});
