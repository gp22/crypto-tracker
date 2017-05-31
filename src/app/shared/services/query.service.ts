import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class QueryService {

  constructor(private http: Http) { }

  getCurrencyData(currency1: string, currency2: string, start: number) {
    const queryUrl: string =
      `/api/?currency1=${currency1}&currency2=${currency2}&start=${start}`

    return this.http.get(queryUrl)
      .map((response) => response.json());
  }
}
