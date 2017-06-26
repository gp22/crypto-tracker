import '../css/main.scss';

const moment = require('moment');
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
  const labels = [];
  const datasets = [];

  dataService.clearChart();

  // Create the date labels for the chart and push into labels
  chartData.currencyPairs[0].data.forEach((data) => {
    const date = (moment.unix(data.date).format('YYYY.MM.DD'));
    labels.push(date);
  });

  // Popluate chart data for each currencyPair and push into datasets
  chartData.currencyPairs.forEach((currencyPair) => {
    const dataSet = dataService.createCurrencyPairDataset(currencyPair);
    datasets.push(dataSet);
  });

  dataService.addChartData(labels, datasets);
});

socket.on('addCurrency', (newCurrencyPair) => {
  const dataSet = dataService.createCurrencyPairDataset(newCurrencyPair);
  // datasets.push(dataSet);
});

socket.on('deleteCurrency', (currencyPairToDelete) => {
  // this.dataService.deleteCurrencyPair(currencyPairToDelete);
});

socket.on('updateDateRange', (updatedChartData) => {
  // this.dataService.updateChart(updatedChartData);
});
