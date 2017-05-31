import { QueryService } from '../shared/services/query.service';
import { Component, OnInit } from '@angular/core';
import 'rxjs/Rx';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  providers: [QueryService]
})
export class ChartComponent implements OnInit {

  constructor(private queryService: QueryService) { }

  ngOnInit() {
    this.queryService.getCurrencyData('BTC', 'USDT', 1488184924)
      .subscribe((stats) => {
        console.log(stats);
      })
  }

}
