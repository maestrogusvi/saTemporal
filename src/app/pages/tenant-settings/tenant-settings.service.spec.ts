import { TestBed } from '@angular/core/testing';

import { TenantSettingsService } from './tenant-settings.service';
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

describe('TenantSettingsService', () => {
    let service: TenantSettingsService;
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
                MatIconModule,
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
        service = TestBed.inject(TenantSettingsService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('enable schedule', () => {
        const tenantId = '123';
        const dummyResponse = { message: 'Schedule resume successfully' };
        service.enableTenantSchedule(tenantId).subscribe((data) => {
            expect(data).toEqual(dummyResponse);
        });

        const req = httpTestingController.expectOne(
            `/scheduler/resume-tenant/${tenantId}`
        );
        expect(req.request.method).toBe('PUT');
        req.flush(dummyResponse);
        httpTestingController.verify();
    });

    it('disable schedule', () => {
        const tenantId = '123';
        const dummyResponse = { message: 'Schedule resume successfully' };
        service.disableTenantSchedule(tenantId).subscribe((data) => {
            expect(data).toEqual(dummyResponse);
        });

        const req = httpTestingController.expectOne(
            `/scheduler/pause-tenant/${tenantId}`
        );
        expect(req.request.method).toBe('PUT');
        req.flush(dummyResponse);
        httpTestingController.verify();
    });
});
