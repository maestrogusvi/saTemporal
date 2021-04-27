import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';

import { FlexLayoutModule } from '@angular/flex-layout';

import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { CreateChartsModule } from '../dashboard/create-charts/create-charts.module';
import { MaterialModule } from '../shared/modules/material.module';
import { PageHeaderModule } from '../shared/components/page-header/page-header.module';


@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    TableModule,
    FlexLayoutModule,
    CreateChartsModule,
    TranslateModule.forRoot(),
    MaterialModule,
    PageHeaderModule
  ]
})
export class ReportsModule { }
