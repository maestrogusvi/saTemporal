import { TestBed } from '@angular/core/testing';

import { ScheduleService } from './schedule.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../shared/modules/material.module';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

describe('ScheduleService', () => {
    let service: ScheduleService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient]
                    }
                }),
                RouterTestingModule,
                HttpClientTestingModule,
                MaterialModule,
                BrowserAnimationsModule,
                ToastrModule.forRoot(),
                FormsModule,
                ReactiveFormsModule,
                MatIconModule
            ],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: [] },
                TranslateService,
                ToastrService
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        service = TestBed.inject(ScheduleService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('get schedule by workflow id', () => {
        const workflowId = '5f198eebe3b6df49d0d7c5d1';
        const dummyResponse = {
            jobClass: 'WORKFLOW',
            jobIdentifierKey: 'JOB',
            triggerIdentifierKey: '',
            startDate: '',
            endDate: '',
            cronExpression: ''
        };
        service.getScheduleByWorkflowId(workflowId).subscribe((data) => {
            expect(data).toEqual(dummyResponse);
        });

        const req = httpTestingController.expectOne(
            `/scheduler/job/${workflowId}`
        );
        expect(req.request.method).toBe('GET');
        req.flush(dummyResponse);
        httpTestingController.verify();
    });

    it('save schedule', () => {
        const dummyData = {
            jobClass: 'WORKFLOW',
            jobIdentifierKey: 'JOB',
            triggerIdentifierKey: 'test',
            startDate: '2020-07-14',
            endDate: '2020-07-18',
            cronExpression: '1 0/1 * 1/1 * ? *'
        };
        const dummyResponse = {
            data: {
                ...dummyData
            }
        };
        service.saveSchedule(dummyData).subscribe((data) => {
            expect(data).toEqual(dummyResponse);
        });

        const req = httpTestingController.expectOne(
            `/scheduler`
        );
        expect(req.request.method).toBe('POST');
        req.flush(dummyResponse);
        httpTestingController.verify();
    });

    it('update schedule', () => {
        const dummyData = {
            id: '123',
            jobClass: 'WORKFLOW',
            jobIdentifierKey: 'JOB',
            triggerIdentifierKey: 'test',
            startDate: '2020-07-14',
            endDate: '2020-07-18',
            cronExpression: '1 0/1 * 1/1 * ? *'
        };
        const dummyResponse = {
            data: {
                ...dummyData
            }
        };
        service.updateSchedule(dummyData).subscribe((data) => {
            expect(data).toEqual(dummyResponse);
        });

        const req = httpTestingController.expectOne(
            `/scheduler`
        );
        expect(req.request.method).toBe('PUT');
        req.flush(dummyResponse);
        httpTestingController.verify();
    });

    it('enable schedule', () => {
        const dummyData = {
            id: '123',
            jobClass: 'WORKFLOW',
            jobIdentifierKey: 'JOB',
            triggerIdentifierKey: 'test',
            startDate: '2020-07-14',
            endDate: '2020-07-18',
            cronExpression: '1 0/1 * 1/1 * ? *'
        };
        const dummyResponse = {
            message: 'Scheduler Resumed Successfully'
        };
        service.enableSchedule(dummyData).subscribe((data) => {
            expect(data).toEqual(dummyResponse);
        });

        const req = httpTestingController.expectOne(
            `/scheduler/resume/${dummyData.id}`
        );
        expect(req.request.method).toBe('PUT');
        req.flush(dummyResponse);
        httpTestingController.verify();
    });

    it('disable schedule', () => {
        const dummyData = {
            id: '123',
            jobClass: 'WORKFLOW',
            jobIdentifierKey: 'JOB',
            triggerIdentifierKey: 'test',
            startDate: '2020-07-14',
            endDate: '2020-07-18',
            cronExpression: '1 0/1 * 1/1 * ? *'
        };
        const dummyResponse = {
            message: 'Scheduler Paused Successfully'
        };
        service.disableSchedule(dummyData).subscribe((data) => {
            expect(data).toEqual(dummyResponse);
        });

        const req = httpTestingController.expectOne(
            `/scheduler/pause/${dummyData.id}`
        );
        expect(req.request.method).toBe('PUT');
        req.flush(dummyResponse);
        httpTestingController.verify();
    });

});
