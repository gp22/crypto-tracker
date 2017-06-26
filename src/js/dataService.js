const Chart = require('chart.js');
const moment = require('moment');

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

function removeChartData(label, dataSet) {

}

function clearChart() {
  cryptoChart.data.labels.length = 0;
  cryptoChart.data.datasets.length = 0;
  cryptoChart.update();
}

function addCurrencyPair(currencyPair) {
  const body = JSON.stringify(currencyPair);
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const options = {
    method: 'POST',
    headers,
    body,
  };

  fetch('/api/currency', options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`Error: ${response.status}`);
    })
    .then((responseData) => {
      const dataSet = createCurrencyPairDataset(responseData);
      addChartData(responseData, [dataSet]);
    })
    .catch(e => e.message);
}

module.exports = {
  createCurrencyPairDataset,
  addChartData,
  removeChartData,
  clearChart,
  addCurrencyPair,
};
