import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

import { ScheduleComponent } from './schedule.component';
import { ScheduleService } from './schedule.service';
import { UtilsService } from '../shared/utils.service';
import { SapperEnum } from '../../../app/core/sapper-enum';

describe('ScheduleComponent', () => {
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;
  let utilService: UtilsService;
  let scheduleService: ScheduleService;
  let httpTestingController: HttpTestingController;
  let router: Router;
  const dialogMock = {
    close: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot()],
      providers: [
        ScheduleService,
        UtilsService,
        DatePipe,
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    httpTestingController = TestBed.inject(HttpTestingController);
    scheduleService = TestBed.inject(ScheduleService);
    utilService = TestBed.inject(UtilsService);
    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('get schedule', () => {
    spyOn(component, 'getSchedule');
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.getSchedule).toHaveBeenCalledTimes(1);
  });

  it('save Schedule Object', () => {
    const dummySchedule = {
      jobClass: 'WORKFLOW',
      jobIdentifierKey: 'JOB',
      triggerIdentifierKey: '332',
      startDate: '2020-07-25',
      endDate: '2020-07-30',
      cronExpression: ''
    };
    const dummyResponse = {
      data: {
        ...dummySchedule,
        id: '1231'
      }
    };
    component.cronExpression = '1 0/1 * 1/1 * ? *' as SapperEnum.cron_expression;
    component.data.workflowId = '332';
    component.schedule = dummySchedule;
    spyOn(component, 'setScheduleObject');
    component.saveSchedule();
    fixture.detectChanges();
    expect(component.setScheduleObject).toHaveBeenCalledTimes(1);
    const req = httpTestingController.expectOne(
      `/scheduler`
    );
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse); // to set response
    utilService.showSuccess('Schedule saved successfully!', '');
  });


  it('update Schedule Object', () => {
    const dummySchedule = {
      id: '1231',
      jobClass: 'WORKFLOW',
      jobIdentifierKey: 'JOB',
      triggerIdentifierKey: '332',
      startDate: '2020-07-25',
      endDate: '2020-07-30',
      cronExpression: ''
    };
    const dummyResponse = {
      data: {
        ...dummySchedule
      }
    };
    component.cronExpression = '1 0/1 * 1/1 * ? *' as SapperEnum.cron_expression;
    component.data.workflowId = '332';
    component.schedule = dummySchedule;
    component.saveSchedule();
    const req1 = httpTestingController.expectOne(
      `/scheduler`
    );
    fixture.detectChanges();
    expect(req1.request.method).toBe('PUT');
    req1.flush(dummyResponse); // to set response
    utilService.showSuccess('Schedule updated successfully!', '');
  });

  it('get schedule dialog closed', () => {
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.closeDialog();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('get schedule by workflow id', fakeAsync(() => {
    const workflowId = '12345';
    const dummyResponse = {
      data: {
        id: '1231',
        jobClass: 'WORKFLOW',
        jobIdentifierKey: 'JOB',
        triggerIdentifierKey: '332',
        startDate: '2020-07-25',
        endDate: '2020-07-30',
        cronExpression: '1 0/1 * 1/1 * ? *'
      }
    };
    component.data.workflowId = '12345';
    component.getSchedule();
    const req = httpTestingController.expectOne(
      `/scheduler/job/${workflowId}`
    );
    fixture.detectChanges();
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse); // to set response
    expect(component.schedule).toEqual(dummyResponse.data);

  }));

  it('is save button disabled', () => {
    component.schedule = {
      id: '1231',
      jobClass: 'WORKFLOW',
      jobIdentifierKey: 'JOB',
      triggerIdentifierKey: '332',
      startDate: '2020-07-25',
      endDate: '2020-07-30',
      cronExpression: '1 0/1 * 1/1 * ? *'
    };
    fixture.detectChanges();
    const menu = fixture.nativeElement.parentNode.querySelector('.margin-right-15');
    expect(menu.disabled).toBeFalsy();
  });

});
