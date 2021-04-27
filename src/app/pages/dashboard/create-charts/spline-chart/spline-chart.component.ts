import { Component, OnInit } from '@angular/core';

import * as c3 from 'c3';

@Component({
  selector: 'sapper-spline-chart',
  templateUrl: './spline-chart.component.html'
})
export class SplineChartComponent implements OnInit {
  public chart;
  constructor() { }

  ngOnInit() {
    c3.generate({
      bindto: '#splineChart',
      size: {
        height: 190
      },
      data: {
        columns: [
          ['Records', 500, 200, 100, 400, 150, 250],
          ['Workflows', 2, 5, 4, 3, 7, 6]
        ],
        axes: {
          Records: 'y',
          Workflows: 'y2'
        },
        types: {
          Records: 'spline',
          Workflows: 'line'
        },
      },
      axis: {
        x: {
          type: 'category',
          categories: ['11pm', '2am', '6am', '10am', '1pm', '5pm']
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
            text: 'Workflows',
            position: 'outer-middle'
          },
          tick: {
            count: 5,
            format: (d) => d.toFixed(0)
          }
        }
      },
      color: {
        pattern: ['#030b5c', '#3f51b5']
      }
    });
  }


}
