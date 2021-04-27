import { Component, OnInit } from '@angular/core';

import * as c3 from 'c3';

@Component({
  selector: 'sapper-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  public chart;
  constructor() { }
  selectedFilter = 'monthly';

  ngOnInit() {
    this.chart = c3.generate({
      bindto: '#lineChart',
      size: {
        height: 190
      },
      data: {
        x: 'x',
        columns: [
          ['x', 'March', 'April', 'May', 'June', 'July'],
          ['Records', 100, 400, 150, 500, 200, 250, 300],
          ['Automations', 4, 3, 7, 2, 5, 6, 3]
        ],
        axes: {
          Records: 'y',
          Automations: 'y2'
        },
        types: {
          Records: 'spline',
          Automations: 'line'
        },
      },
      axis: {
        x: {
          type: 'category',
          categories: ['March', 'April', 'May', 'June', 'July']
        },
        y: {
          label: {
            text: 'Records',
            position: 'outer-middle'
          }
        },
        y2: {
          show: true,
          label: {
            text: 'Automations',
            position: 'outer-middle'
          },
          tick: {
            count: 5,
            format: (d) => d.toFixed(0)
          }
        }
      },
      color: {
        pattern: ['#030b5c', '#07AA7B']
      }
    });
  }

  showChartWeekly() {
    this.chart.load({
      columns: [
        ['x', 'Week1 ', 'Week2', 'Week3', 'Week4'],
        ['Records', 450, 200, 150, 500],
        ['Automations', 4, 3, 7, 2]
      ],
    });
    this.selectedFilter = 'weekly';
  }

  showChartMonthly() {
    this.chart.load({
      columns: [
        ['x', 'March', 'April', 'May', 'June', 'July'],
        ['Records', 100, 400, 150, 500, 200],
        ['Automations', 1, 3, 5, 1, 4]
      ],
    });

    this.selectedFilter = 'monthly';
  }

  showChartDailyBasis() {
    this.chart.load({
      columns: [
        ['x', 'Monday ', 'Tuesday', 'Wednesday', 'Thursday	', 'Friday', 'Saturday', 'Friday'],
        ['Records', 450, 200, 150, 500, 600, 370, 200],
        ['Automations', 6, 1, 4, 3, 6, 3, 3]
      ]
    });

    this.selectedFilter = 'last7days';
  }
}
