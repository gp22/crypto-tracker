import '../css/main.scss';

const Chart = require('chart.js');
const io = require('socket.io-client');
const dataService = require('./dataService');

const socket = io();

  // this.socket.emit('updateDateRange');
  // this.socket.emit('deleteCurrency', { currencyPair: 'USDT_BTC' });
  // this.socket.emit('addCurrency', { currencyPair: 'USDT_BTC' });

const ctx = document.getElementById('cryptoChart');

const cryptoChart = new Chart(ctx, {
  type: 'line',
  data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
      }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  }
});

socket.on('newChart', (chartData) => {
  // this.chartData = this.dataService.createChart(chartData);
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
