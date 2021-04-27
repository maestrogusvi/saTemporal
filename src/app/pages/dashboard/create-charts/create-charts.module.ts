import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChartComponent } from './line-chart/line-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { SplineChartComponent } from './spline-chart/spline-chart.component';

@NgModule({
  declarations: [LineChartComponent, BarChartComponent, SplineChartComponent],
  imports: [
    CommonModule
  ],
  exports: [ LineChartComponent, BarChartComponent, SplineChartComponent],
})
export class CreateChartsModule { }
