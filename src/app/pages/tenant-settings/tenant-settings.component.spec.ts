import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TenantSettingsComponent } from './tenant-settings.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TenantSettingsService } from './tenant-settings.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UtilsService } from '../shared/utils.service';
import { ToastrModule } from 'ngx-toastr';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('TenantSettingsComponent', () => {
  let component: TenantSettingsComponent;
  let fixture: ComponentFixture<TenantSettingsComponent>;
  const dialogMock = {
    close: () => { }
  };
  let utilService: UtilsService;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TenantSettingsComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot()
      ],
      providers: [
        TenantSettingsService,
        UtilsService,
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: Router, useValue: Router }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantSettingsComponent);
    component = fixture.componentInstance;
    utilService = TestBed.inject(UtilsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('get schedule dialog closed', () => {
    fixture.detectChanges();
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.closeDialog();
    expect(spy).toHaveBeenCalled();
  });

  it('enable schedule by tenant id', () => {
    const option = {
      field: 'disable_schedule'
    };
    const dummyResponse = { message: 'Schedule resume successfully' };
    const tenantId = '123';
    component.updateSchedule(option);
    const req = httpTestingController.expectOne(
      `/scheduler/resume-tenant/${tenantId}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush(dummyResponse); // to set response
    fixture.detectChanges();
    utilService.showSuccess(dummyResponse, '');
  });

  it('disable schedule by tenant id', () => {
    const option = {
      field: 'disable_schedule'
    };
    const dummyResponse = { message: 'Schedule resume successfully' };
    const tenantId = '123';
    component.settings[option.field] = !component.settings[option.field];
    component.updateSchedule(option);
    const req = httpTestingController.expectOne(
      `/scheduler/pause-tenant/${tenantId}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush(dummyResponse); // to set response
    fixture.detectChanges();
    utilService.showSuccess(dummyResponse, '');
  });

});
