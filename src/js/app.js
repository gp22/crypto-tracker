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

socket.on('newChart', (chartData) => {
  labels.length = 0;
  datasets.length = 0;

  chartData.currencyPairs[0].data.forEach((data) => {
    const date = (moment.unix(data.date).format('YYYY.MM.DD'));
    labels.push(date);
  });

  chartData.currencyPairs.forEach((currencyPair) => {
    const label = currencyPair.currencyPair;
    const data = [];
    const dataSet = ({
      label,
      data,
      borderWidth: 1,
      fill: false,
    });

    currencyPair.data.forEach((currencyData) => {
      data.push(currencyData.high);
    });

    datasets.push(dataSet);
  });
  // this.chartData = this.dataService.createChart(chartData);
  const cryptoChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets,
    },
    options,
  });
});

socket.on('addCurrency', (newCurrencyPair) => {
  // this.dataService.addCurrencyPair(newCurrencyPair);
});

socket.on('deleteCurrency', (currencyPairToDelete) => {
  // this.dataService.deleteCurrencyPair(currencyPairToDelete);
});

socket.on('updateDateRange', (updatedChartData) => {
  // this.dataService.updateChart(updatedChartData);
});
