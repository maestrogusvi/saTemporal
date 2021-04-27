import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../shared/modules/material.module';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { WorkflowService } from './workflow.service';

describe('WorkflowService', () => {
    let service: WorkflowService;
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
        service = TestBed.inject(WorkflowService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('upload meta file', () => {
        const type = 'JSON';
        const event = {
            target: {
                files: [{
                    lastModified: 1555348814186,
                    lastModifiedDate: "Mon Apr 15 2019 22:50:14 GMT+0530 (India Standard Time)",
                    name: "sample.json",
                    size: 553,
                    type: "application/json",
                    webkitRelativePath: ""
                }]
            }
        };

        const dummyResponse = {
            "data": {
                "createdBy": "rohini123",
                "createdDate": "2020-07-09T11:00:37.0514792+05:30",
                "lastModifiedBy": "rohini123",
                "lastModifiedDate": "2020-07-09T11:00:37.0514792+05:30",
                "id": "5f06ab7d5835161160e8475b",
                "meta": "{\"updated_on\":{\"type\":\"string\",\"order\":8},\"country\":{\"type\":\"string\",\"order\":17},\"ss_no\":{\"type\":\"string\",\"order\":37},\"suffix\":{\"type\":\"null\",\"order\":24},\"jobtype_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":44},\"location_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":26},\"securityRoles\":{\"type\":\"null\",\"order\":6},\"locale_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":57},\"password\":{\"type\":\"string\",\"order\":23},\"workphone\":{\"type\":\"string\",\"order\":47},\"state\":{\"type\":\"string\",\"order\":22},\"id\":{\"type\":\"string\",\"order\":28},\"desired_job_type_id\":{\"type\":\"null\",\"order\":50},\"fax\":{\"type\":\"string\",\"order\":18},\"job_title\":{\"type\":\"null\",\"order\":35},\"securityDomain\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":1},\"zip\":{\"type\":\"string\",\"order\":10},\"fname\":{\"type\":\"string\",\"order\":45},\"password_changed\":{\"type\":\"boolean\",\"order\":43},\"positions\":{\"type\":\"null\",\"order\":5},\"terminated_on\":{\"type\":\"null\",\"order\":39},\"requiredJobRoles\":{\"type\":\"null\",\"order\":3},\"is_manager\":{\"type\":\"boolean\",\"order\":42},\"special_user\":{\"type\":\"boolean\",\"order\":31},\"person_no\":{\"type\":\"string\",\"order\":49},\"created_on\":{\"type\":\"string\",\"order\":9},\"is_508_user\":{\"type\":\"boolean\",\"order\":32},\"timezone_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":56},\"home_domain\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":41},\"status\":{\"type\":\"string\",\"order\":25},\"ethnicity\":{\"type\":\"null\",\"order\":12},\"gender\":{\"type\":\"number\",\"order\":20},\"homephone\":{\"type\":\"string\",\"order\":48},\"city\":{\"type\":\"string\",\"order\":16},\"date_of_birth\":{\"type\":\"null\",\"order\":34},\"person_type\":{\"type\":\"string\",\"order\":38},\"mname\":{\"type\":\"string\",\"order\":33},\"title\":{\"type\":\"string\",\"order\":19},\"job_title_type\":{\"type\":\"null\",\"order\":29},\"lname\":{\"type\":\"string\",\"order\":46},\"secret_question\":{\"type\":\"null\",\"order\":51},\"correspondence_preference3\":{\"type\":\"string\",\"order\":55},\"started_on\":{\"type\":\"string\",\"order\":40},\"correspondence_preference2\":{\"type\":\"string\",\"order\":54},\"manager_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":58},\"optionalJobRoles\":{\"type\":\"null\",\"order\":4},\"correspondence_preference1\":{\"type\":\"string\",\"order\":53},\"email\":{\"type\":\"string\",\"order\":21},\"customValues\":{\"custom1\":{\"type\":\"null\",\"order\":1},\"custom2\":{\"type\":\"null\",\"order\":2},\"order\":2},\"addr2\":{\"type\":\"string\",\"order\":14},\"company_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":36},\"addr1\":{\"type\":\"string\",\"order\":13},\"addr3\":{\"type\":\"string\",\"order\":15},\"religion\":{\"type\":\"null\",\"order\":11},\"secret_answer\":{\"type\":\"null\",\"order\":52},\"home_company_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":30},\"audiencetypes\":{\"type\":\"null\",\"order\":7},\"username\":{\"type\":\"string\",\"order\":27}}",
                "requiredProperties": {
                    "delimiter": ","
                },
                "fileType": "JSON",
                "fileName": "sample.json"
            }
        };
        
        service.uploadFile(type, event.target.files[0]).subscribe((data) => {
            expect(data).toEqual(dummyResponse);
        });

        const req = httpTestingController.expectOne(
            'meta?fileType=' + type
        );
        expect(req.request.method).toBe('POST');
        req.flush(dummyResponse);
        httpTestingController.verify();
    });

    it('save meta', () => {
        const metaId = "5f06ab7d5835161160e8475b";
        const dummyData = {
            "createdBy": "rohini123",
            "createdDate": "2020-07-09T11:00:37.0514792+05:30",
            "lastModifiedBy": "rohini123",
            "lastModifiedDate": "2020-07-09T11:00:37.0514792+05:30",
            "id": "5f06ab7d5835161160e8475b",
            "meta": "{\"updated_on\":{\"type\":\"string\",\"order\":8},\"country\":{\"type\":\"string\",\"order\":17},\"ss_no\":{\"type\":\"string\",\"order\":37},\"suffix\":{\"type\":\"null\",\"order\":24},\"jobtype_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":44},\"location_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":26},\"securityRoles\":{\"type\":\"null\",\"order\":6},\"locale_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":57},\"password\":{\"type\":\"string\",\"order\":23},\"workphone\":{\"type\":\"string\",\"order\":47},\"state\":{\"type\":\"string\",\"order\":22},\"id\":{\"type\":\"string\",\"order\":28},\"desired_job_type_id\":{\"type\":\"null\",\"order\":50},\"fax\":{\"type\":\"string\",\"order\":18},\"job_title\":{\"type\":\"null\",\"order\":35},\"securityDomain\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":1},\"zip\":{\"type\":\"string\",\"order\":10},\"fname\":{\"type\":\"string\",\"order\":45},\"password_changed\":{\"type\":\"boolean\",\"order\":43},\"positions\":{\"type\":\"null\",\"order\":5},\"terminated_on\":{\"type\":\"null\",\"order\":39},\"requiredJobRoles\":{\"type\":\"null\",\"order\":3},\"is_manager\":{\"type\":\"boolean\",\"order\":42},\"special_user\":{\"type\":\"boolean\",\"order\":31},\"person_no\":{\"type\":\"string\",\"order\":49},\"created_on\":{\"type\":\"string\",\"order\":9},\"is_508_user\":{\"type\":\"boolean\",\"order\":32},\"timezone_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":56},\"home_domain\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":41},\"status\":{\"type\":\"string\",\"order\":25},\"ethnicity\":{\"type\":\"null\",\"order\":12},\"gender\":{\"type\":\"number\",\"order\":20},\"homephone\":{\"type\":\"string\",\"order\":48},\"city\":{\"type\":\"string\",\"order\":16},\"date_of_birth\":{\"type\":\"null\",\"order\":34},\"person_type\":{\"type\":\"string\",\"order\":38},\"mname\":{\"type\":\"string\",\"order\":33},\"title\":{\"type\":\"string\",\"order\":19},\"job_title_type\":{\"type\":\"null\",\"order\":29},\"lname\":{\"type\":\"string\",\"order\":46},\"secret_question\":{\"type\":\"null\",\"order\":51},\"correspondence_preference3\":{\"type\":\"string\",\"order\":55},\"started_on\":{\"type\":\"string\",\"order\":40},\"correspondence_preference2\":{\"type\":\"string\",\"order\":54},\"manager_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":58},\"optionalJobRoles\":{\"type\":\"null\",\"order\":4},\"correspondence_preference1\":{\"type\":\"string\",\"order\":53},\"email\":{\"type\":\"string\",\"order\":21},\"customValues\":{\"custom1\":{\"type\":\"null\",\"order\":1},\"custom2\":{\"type\":\"null\",\"order\":2},\"order\":2},\"addr2\":{\"type\":\"string\",\"order\":14},\"company_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":36},\"addr1\":{\"type\":\"string\",\"order\":13},\"addr3\":{\"type\":\"string\",\"order\":15},\"religion\":{\"type\":\"null\",\"order\":11},\"secret_answer\":{\"type\":\"null\",\"order\":52},\"home_company_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":30},\"audiencetypes\":{\"type\":\"null\",\"order\":7},\"username\":{\"type\":\"string\",\"order\":27}}",
            "requiredProperties": {
                "delimiter": ","
            },
            "fileType": "JSON",
            "fileName": "sample.json"
        };
        const dummyResponse = {
            data: {
                ...dummyData
            }
        };
        service.saveMeta(dummyData).subscribe((data) => {
            expect(data).toEqual(dummyResponse);
        });

        const req = httpTestingController.expectOne(
            `meta/${dummyData.id}`
        );
        expect(req.request.method).toBe('PUT');
        req.flush(dummyResponse);
        httpTestingController.verify();
    });

    it('get meta', () => {
        const metaId = "5f06ab7d5835161160e8475b";
        const dummyResponse = {
            "data": {
                "createdBy": "rohini123",
                "createdDate": "2020-07-09T11:00:37.0514792+05:30",
                "lastModifiedBy": "rohini123",
                "lastModifiedDate": "2020-07-09T11:00:37.0514792+05:30",
                "id": "5f06ab7d5835161160e8475b",
                "meta": "{\"updated_on\":{\"type\":\"string\",\"order\":8},\"country\":{\"type\":\"string\",\"order\":17},\"ss_no\":{\"type\":\"string\",\"order\":37},\"suffix\":{\"type\":\"null\",\"order\":24},\"jobtype_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":44},\"location_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":26},\"securityRoles\":{\"type\":\"null\",\"order\":6},\"locale_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":57},\"password\":{\"type\":\"string\",\"order\":23},\"workphone\":{\"type\":\"string\",\"order\":47},\"state\":{\"type\":\"string\",\"order\":22},\"id\":{\"type\":\"string\",\"order\":28},\"desired_job_type_id\":{\"type\":\"null\",\"order\":50},\"fax\":{\"type\":\"string\",\"order\":18},\"job_title\":{\"type\":\"null\",\"order\":35},\"securityDomain\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":1},\"zip\":{\"type\":\"string\",\"order\":10},\"fname\":{\"type\":\"string\",\"order\":45},\"password_changed\":{\"type\":\"boolean\",\"order\":43},\"positions\":{\"type\":\"null\",\"order\":5},\"terminated_on\":{\"type\":\"null\",\"order\":39},\"requiredJobRoles\":{\"type\":\"null\",\"order\":3},\"is_manager\":{\"type\":\"boolean\",\"order\":42},\"special_user\":{\"type\":\"boolean\",\"order\":31},\"person_no\":{\"type\":\"string\",\"order\":49},\"created_on\":{\"type\":\"string\",\"order\":9},\"is_508_user\":{\"type\":\"boolean\",\"order\":32},\"timezone_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":56},\"home_domain\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":41},\"status\":{\"type\":\"string\",\"order\":25},\"ethnicity\":{\"type\":\"null\",\"order\":12},\"gender\":{\"type\":\"number\",\"order\":20},\"homephone\":{\"type\":\"string\",\"order\":48},\"city\":{\"type\":\"string\",\"order\":16},\"date_of_birth\":{\"type\":\"null\",\"order\":34},\"person_type\":{\"type\":\"string\",\"order\":38},\"mname\":{\"type\":\"string\",\"order\":33},\"title\":{\"type\":\"string\",\"order\":19},\"job_title_type\":{\"type\":\"null\",\"order\":29},\"lname\":{\"type\":\"string\",\"order\":46},\"secret_question\":{\"type\":\"null\",\"order\":51},\"correspondence_preference3\":{\"type\":\"string\",\"order\":55},\"started_on\":{\"type\":\"string\",\"order\":40},\"correspondence_preference2\":{\"type\":\"string\",\"order\":54},\"manager_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":58},\"optionalJobRoles\":{\"type\":\"null\",\"order\":4},\"correspondence_preference1\":{\"type\":\"string\",\"order\":53},\"email\":{\"type\":\"string\",\"order\":21},\"customValues\":{\"custom1\":{\"type\":\"null\",\"order\":1},\"custom2\":{\"type\":\"null\",\"order\":2},\"order\":2},\"addr2\":{\"type\":\"string\",\"order\":14},\"company_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":36},\"addr1\":{\"type\":\"string\",\"order\":13},\"addr3\":{\"type\":\"string\",\"order\":15},\"religion\":{\"type\":\"null\",\"order\":11},\"secret_answer\":{\"type\":\"null\",\"order\":52},\"home_company_id\":{\"displayName\":{\"type\":\"string\",\"order\":2},\"id\":{\"type\":\"string\",\"order\":1},\"order\":30},\"audiencetypes\":{\"type\":\"null\",\"order\":7},\"username\":{\"type\":\"string\",\"order\":27}}",
                "requiredProperties": {
                    "delimiter": ","
                },
                "fileType": "JSON",
                "fileName": "sample.json"
            }
        };
        service.getMeta(metaId).subscribe((data) => {
            expect(data).toEqual(dummyResponse);
        });

        const req = httpTestingController.expectOne(
            `meta/${metaId}`
        );
        expect(req.request.method).toBe('GET');
        req.flush(dummyResponse);
        httpTestingController.verify();
    });
});
