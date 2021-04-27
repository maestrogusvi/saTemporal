import { Component, OnInit } from '@angular/core';
import * as c3 from 'c3';

@Component({
  selector: 'sapper-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit {
  public chart;
  selectedFilter = 'monthly';

  constructor() { }

  ngOnInit() {
    this.chart = c3.generate({
      bindto: '#barChart',
      size: {
        height: 190
      },
      data: {
        x: 'x',
        columns: [
          ['x', 'Salesforce ', 'Saba', 'SumTotal', 'Workday', 'ADP'],
          ['API calls', 100000, 300000, 160000, 250000, 140000]
        ],
        type: 'bar',
      },
      axis: {
        rotated: true,
        x: {
          type: 'category',
          label: {
            text: 'Applications',
            position: 'outer-center'
          }
        }
      }
    });
  }

  showChartWeekly() {
    this.chart.load({
      columns: [
        ['x', 'ADP', 'Salesforce ', 'SumTotal', 'Workday', 'Saba'],
        ['API calls', 100000, 300000, 160000, 250000, 140000]
      ],
    });

    this.selectedFilter = 'weekly';
  }

  showChartMonthly() {
    this.chart.load({
      columns: [
        ['x', 'Workday', 'SumTotal', 'Salesforce ', 'Saba', 'Workday', 'ADP'],
        ['API calls', 10000, 30000, 10000, 25000, 10000]
      ],
    });

    this.selectedFilter = 'monthly';
  }

  showChartDailyBasis() {
    this.chart.load({
      columns: [
        ['x', 'SumTotal', 'Workday', 'ADP', 'Saba ', 'Salesforce'],
        ['API calls', 9000, 40000, 5600, 25000, 14000]
      ]
    });

    this.selectedFilter = 'last7days';
  }
}
