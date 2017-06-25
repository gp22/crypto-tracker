import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  private chart = {};

  getChart() {
    return this.chart;
  }

  addCurrencyPair(currencyPair) {
    this.chart.currencyPairs.push(currencyPair);
  }

  deleteCurrencyPair(currencyPairToDelete) {
    const index = this.chart.currencyPairs.findIndex((element) => {
      return element.currencyPair === currencyPairToDelete;
    });

    this.chart.currencyPairs.splice(index, 1);
  }
}
