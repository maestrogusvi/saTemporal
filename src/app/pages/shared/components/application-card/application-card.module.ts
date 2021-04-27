import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ApplicationCardComponent } from './application-card.component';

import { MaterialModule } from '../../modules/material.module';

@NgModule({
  declarations: [ApplicationCardComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule
  ],
  exports: [
    ApplicationCardComponent
  ]
})
export class ApplicationCardModule { }
