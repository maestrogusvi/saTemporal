import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';

import { WorkflowCardComponent } from './workflow-card.component';
import { MaterialModule } from '../../modules/material.module';
import { ApplicationCardModule } from '../application-card/application-card.module';


@NgModule({
  declarations: [WorkflowCardComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ApplicationCardModule,
    FlexLayoutModule,
    EcoFabSpeedDialModule
  ],
  exports: [
    WorkflowCardComponent
  ]
})
export class WorkflowCardModule { }
