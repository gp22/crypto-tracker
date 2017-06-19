import { QueryService } from '../shared/services/query.service';
import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import Chart from 'chart.js';
import 'rxjs/Rx';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  providers: [QueryService]
})
export class ChartComponent implements OnInit {
  private socket = io();

  constructor(private queryService: QueryService) { }

  ngOnInit() {
    this.socket.on('newChart', (chartData) => {
      console.log(chartData);
    });
  }

}
