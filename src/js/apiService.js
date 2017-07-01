function getNewCurrencyFromAPI(currencyPair) {
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

  return fetch('/api/currency', options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`Error: ${response.status}`);
    });
}

function removeCurrencyFromAPI(currencyPair) {
  const body = JSON.stringify(currencyPair);
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const options = {
    method: 'DELETE',
    headers,
    body,
  };

  return fetch('/api/currency', options)
    .then((response) => {
      if (response.ok) {
        return;
      }
      throw new Error(`Error: ${response.status}`);
    });
}

module.exports = {
  getNewCurrencyFromAPI,
  removeCurrencyFromAPI,
};
