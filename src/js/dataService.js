const Chart = require('chart.js');

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

function addChartData(labels, dataSets) {
  labels.forEach((label) => {
    cryptoChart.data.labels.push(label);
  });

  dataSets.forEach((dataSet) => {
    cryptoChart.data.datasets.push(dataSet);
  });

  cryptoChart.update();
}

function removeChartData(label, dataSet) {

}

function clearChart(chart) {
  cryptoChart.data.labels.length = 0;
  cryptoChart.data.datasets.length = 0;
  cryptoChart.update();
}

function addCurrencyPair(currencyPair) {
  fetch('/api/currency', currencyPair).then((response) => {
    console.log(response);
  });
}

module.exports = {
  createCurrencyPairDataset,
  addChartData,
  removeChartData,
  clearChart,
  addCurrencyPair,
};
