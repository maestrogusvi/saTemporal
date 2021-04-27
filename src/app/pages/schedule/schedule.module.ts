import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CronEditorModule } from 'cron-editor';

import { ScheduleComponent } from './schedule.component';
import { MaterialModule } from '../shared/modules/material.module';



@NgModule({
  declarations: [ScheduleComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    CronEditorModule,
    FlexLayoutModule
  ],
  providers: [DatePipe]
})
export class ScheduleModule {

}
