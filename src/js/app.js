import '../css/main.scss';

const moment = require('moment');
const Chart = require('chart.js');
const io = require('socket.io-client');
const dataService = require('./dataService');

const socket = io();
const currencyButtons = document.querySelectorAll('.currency-button');
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

function addChartData(chart, labels, dataSets) {
  labels.forEach((label) => {
    chart.data.labels.push(label);
  });

  dataSets.forEach((dataSet) => {
    chart.data.datasets.push(dataSet);
  });

  chart.update();
}

function removeChartData(chart, label, dataSet) {

}

function clearChart(chart) {
  chart.data.labels.length = 0;
  chart.data.datasets.length = 0;
  chart.update();
}

function addCurrencyPair(currencyPair) {
  fetch('/api/currency', currencyPair).then((response) => {
    console.log(response);
  });
}

currencyButtons.forEach((button) => {
  button.addEventListener('click', function () {
    const currency1 = 'USDT';
    const currency2 = this.id.toUpperCase();
    const currencyPair = { currency1, currency2 };

    addCurrencyPair(currencyPair);
  });
});

socket.on('newChart', (chartData) => {
  const labels = [];
  const datasets = [];

  clearChart(cryptoChart);

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

  addChartData(cryptoChart, labels, datasets);
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
