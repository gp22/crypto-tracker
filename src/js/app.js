import '../css/main.scss';

const moment = require('moment');
const Chart = require('chart.js');
const io = require('socket.io-client');
const dataService = require('./dataService');

const socket = io();

const ctx = document.getElementById('cryptoChart');
const labels = [];
const datasets = [];
const options = {
  responsive: true,
  maintainAspectRatio: false,
};

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

socket.on('newChart', (chartData) => {
  labels.length = 0;
  datasets.length = 0;

  // Create the date labels for the chart and push into labels
  chartData.currencyPairs[0].data.forEach((data) => {
    const date = (moment.unix(data.date).format('YYYY.MM.DD'));
    labels.push(date);
  });

  // Popluate chart data for each currencyPair and push into datasets
  chartData.currencyPairs.forEach((currencyPair) => {
    const dataSet = createCurrencyPairDataset(currencyPair);
    datasets.push(dataSet);
  });

  // Create the chart
  const cryptoChart = new Chart(ctx, {
    type: 'line',
    options,
    data: {
      labels,
      datasets,
    },
  });
});

socket.on('addCurrency', (newCurrencyPair) => {
  const dataSet = createCurrencyPairDataset(newCurrencyPair);
  // datasets.push(dataSet);
});

socket.on('deleteCurrency', (currencyPairToDelete) => {
  // this.dataService.deleteCurrencyPair(currencyPairToDelete);
});

socket.on('updateDateRange', (updatedChartData) => {
  // this.dataService.updateChart(updatedChartData);
});

socket.emit('addCurrency', { currencyPair: 'USDT_BTC' });
