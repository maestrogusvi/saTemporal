import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

import { CronOptions } from 'cron-editor/lib/CronOptions';
import { ScheduleService } from './schedule.service';
import { Schedule } from './schedule.interface';
import { SapperEnum } from '../../core/sapper-enum';
import { UtilsService } from '../shared/utils.service';

@Component({
  selector: 'sapper-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})

export class ScheduleComponent implements OnInit {

  public cronExpression = SapperEnum.cron_expression;
  public isCronDisabled = false;
  public schedule: Schedule = {
    jobClass: 'WORKFLOW',
    jobIdentifierKey: 'JOB',
    triggerIdentifierKey: '',
    startDate: '',
    endDate: '',
    cronExpression: ''
  };
  public cronOptions: CronOptions = {
    formInputClass: 'form-control cron-editor-input',
    formSelectClass: 'form-control cron-editor-select',
    formRadioClass: 'cron-editor-radio',
    formCheckboxClass: 'cron-editor-checkbox',

    defaultTime: '10:00:00',
    use24HourTime: true,

    hideMinutesTab: false,
    hideHourlyTab: false,
    hideDailyTab: false,
    hideWeeklyTab: false,
    hideMonthlyTab: false,
    hideYearlyTab: false,
    hideAdvancedTab: false,

    hideSeconds: false,
    removeSeconds: false,
    removeYears: false
  };


  constructor(
    public dialogRef: MatDialogRef<ScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public scheduleService: ScheduleService,
    public datePipe: DatePipe,
    public utilService: UtilsService
  ) {
    this.schedule.cronExpression = this.cronExpression;
    this.schedule.triggerIdentifierKey = this.data.workflowId;
    this.schedule.jobIdentifierKey = this.data.workflowId;
  }

  ngOnInit(): void {
    this.getSchedule();
  }

  /**
   * Used to close dialog
   * @returns void
   */
  closeDialog(): void {
    this.dialogRef.close(this.schedule);
  }

  /**
   * Used to fetch schedule data
   * @returns void
   */
  getSchedule(): void {
    this.scheduleService.getScheduleByWorkflowId(this.data.workflowId).subscribe((schedule) => {
      schedule = this.utilService.fetchResponseData(schedule);
      if (schedule) {
        this.schedule = schedule;
        this.cronExpression = this.schedule.cronExpression as SapperEnum.cron_expression;
        this.schedule.startDate = this.utilService.convertDateToShow(this.schedule.startDate);
        this.schedule.endDate = this.utilService.convertDateToShow(this.schedule.endDate);
      }
    });
  }

  /**
   * Used to set schedule object before save or update schedule
   * @returns void
   */
  public setScheduleObject(): void {
    this.schedule.startDate = this.datePipe.transform(this.schedule.startDate, SapperEnum.backend_date);
    this.schedule.endDate = this.datePipe.transform(this.schedule.endDate, SapperEnum.backend_date);
    this.schedule.cronExpression = this.cronExpression;
    this.schedule.triggerIdentifierKey = this.data.workflowId;
  }

  /**
   * Used to save or update schedule data
   * @returns void
   */
  saveSchedule(): void {
    this.setScheduleObject();
    if (this.schedule && this.schedule.id) {
      this.scheduleService.updateSchedule(this.schedule).subscribe((schedule: Schedule) => {
        this.schedule = schedule;
        this.utilService.showSuccess('Schedule updated successfully!', '');
      });
    } else {
      this.scheduleService.saveSchedule(this.schedule).subscribe((schedule: Schedule) => {
        this.schedule = schedule;
        this.utilService.showSuccess('Schedule saved successfully!', '');
      });
    }
  }

  /**
   * Used validate save button of schedule tab
   * @returns boolean
   */
  isSaveDisabled(): boolean {
    const requiredSchedule = [this.schedule.startDate, this.schedule.endDate, this.schedule.cronExpression];
    return requiredSchedule.includes('') || requiredSchedule.includes(null);
  }


}
