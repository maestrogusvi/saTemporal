import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import {TableModule} from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ApplicationUsedComponent } from './application-used/application-used.component';
import { CreateChartsModule } from './create-charts/create-charts.module';
import { MaterialModule } from '../shared/modules/material.module';
import { PageHeaderModule } from '../shared/components/page-header/page-header.module';


@NgModule({
  declarations: [ DashboardComponent, ApplicationUsedComponent ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    TableModule,
    FlexLayoutModule,
    CreateChartsModule,
    TranslateModule.forRoot(),
    MaterialModule,
    PageHeaderModule
  ]
})
export class DashboardModule { }
