import '../css/main.scss';

const socket = require('socket.io-client')();
const dataService = require('./dataService');

(function ChartManager() {
  const currencyButtons = document.querySelectorAll('.currency-button');
  const dateButtons = document.querySelectorAll('.date-button');

  /* ********************************************************************** */
  /* --------------------------- Click Handlers --------------------------- */
  /* ********************************************************************** */

  currencyButtons.forEach((button) => {
    // button.enabled = false;
    button.addEventListener('click', function () {
      const currency1 = 'USDT';
      const currency2 = this.id.toUpperCase();
      const currencyPair = { currency1, currency2 };

      if (this.classList.contains('btn--disabled')) {
        this.enabled = false;
        dataService.addCurrencyPair(currencyPair)
          .then(() => {
            socket.emit('addCurrency', currencyPair);
            dataService.toggleButton(this.id);
            this.enabled = true;
          })
          .catch((e) => {
            console.error(e);
            this.enabled = true;
          });
      } else {
        this.enabled = false;
        dataService.removeCurrencyPair(currencyPair)
          .then(() => {
            socket.emit('deleteCurrency', currencyPair);
            dataService.toggleButton(this.id);
            this.enabled = true;
          })
          .catch((e) => {
            console.error(e);
            this.enabled = true;
          });
      }
    });
  });

  dateButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const newDateRange = this.id;

      dataService.updateDateRange(newDateRange)
        .then(() => {
          socket.emit('newChart');
        });
    });
  });

  /* ********************************************************************** */
  /* -------------------------- socket.io events -------------------------- */
  /* ********************************************************************** */

  socket.on('newChart', (chartData) => {
    dataService.createNewChart(chartData);
  });

  socket.on('addCurrency', (newCurrencyPair) => {
    const dataSet = dataService.createCurrencyPairDataset(newCurrencyPair);
    dataService.addChartData(newCurrencyPair, [dataSet]);
  });

  socket.on('deleteCurrency', (currencyPairToDelete) => {
    dataService.removeChartData(currencyPairToDelete);
  });
}());
