import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { WorkflowListingService } from './workflow-listing.service';
import { MaterialModule } from '../../shared/modules/material.module';

describe('WorkflowListingService', () => {
  let workflowListingService: WorkflowListingService;
  let httpTestingController: HttpTestingController;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MaterialModule,
      ],
    })
      .compileComponents()
      .then(() => {
        workflowListingService = TestBed.inject(WorkflowListingService);
        httpTestingController = TestBed.inject(HttpTestingController);
      })
  );

  it('should be created', () => {
    expect(workflowListingService).toBeTruthy();
  });

  it('should get workflow listing', () => {

    const dummyResponse = [{
      id: '5f2a79eece32365378a0b3c9',
      name: 'Workflow name',
      tasks: {}
    }];
    workflowListingService.getWorkflowList().subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(`/workflow`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });


  it('should save workflow', () => {
    const dummyData = {
      name: 'Workflow test',
      description: 'test',
      numPartitions: 3,
      reportTopic: 'test1',
      tasks: {}
    };
    const dummyResponse = {
      data: {
        ...dummyData,
      },
    };
    workflowListingService.saveWorkflow(dummyData).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(`/workflow`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });
});
