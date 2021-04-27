import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { WorkflowWindowService } from './workflow-window.service';
import { MaterialModule } from '../../shared/modules/material.module';
import { IWorkflow } from '../workflow.interface';

describe('WorkflowWindowService', () => {
  let workflowWindowService: WorkflowWindowService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TranslateModule.forRoot(),
      HttpClientTestingModule,
      ToastrModule.forRoot(),
      MaterialModule
    ]
  }).compileComponents().then(() => {
    workflowWindowService = TestBed.inject(WorkflowWindowService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it('should be created', () => {
    expect(workflowWindowService).toBeTruthy();
  });

  it('save workflow function', () => {
    const workflowDetails: IWorkflow = {
      name: 'w2',
      description: 'w2 description',
      numPartitions: 0,
      reportTopic: '',
      tasks: {}
    };
    const dummyResponse = {
      data: {
        createdBy: 'amarendra',
        createdDate: '2020-07-16T17:32:52.957+05:30',
        description: 'w2 description',
        id: '5f1041eccfde330621602a1c',
        lastModifiedBy: 'amarendra',
        lastModifiedDate: '2020-07-16T17:32:52.957+05:30',
        name: 'w2',
        numPartitions: 0,
        reportTopic: '',
        tasks: {}
      }
    };
    workflowWindowService.saveWorkflow(workflowDetails).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(
      '/workflow'
    );
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });

  it('update workflow function', () => {
    const workflowDetails: IWorkflow = {
      id: '5f1041eccfde330621602a1c',
      name: 'w2',
      description: 'w2 description',
      numPartitions: 0,
      reportTopic: '',
      tasks: {}
    };
    const dummyResponse = {
      data: {
        createdBy: 'amarendra',
        createdDate: '2020-07-16T17:32:52.957+05:30',
        description: 'w2 description',
        id: '5f1041eccfde330621602a1c',
        lastModifiedBy: 'amarendra',
        lastModifiedDate: '2020-07-16T17:32:52.957+05:30',
        name: 'w2',
        numPartitions: 0,
        reportTopic: '',
        tasks: {}
      }
    };
    workflowWindowService.updateWorkflow(workflowDetails).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(
      '/workflow'
    );
    expect(req.request.method).toBe('PUT');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });

  it('get workflow by id function', () => {
    const id = '5f1041eccfde330621602a1c';
    const dummyResponse = {
      data: {
        createdBy: 'amarendra',
        createdDate: '2020-07-16T17:32:52.957+05:30',
        description: 'w2 description',
        id: '5f1041eccfde330621602a1c',
        lastModifiedBy: 'amarendra',
        lastModifiedDate: '2020-07-16T17:32:52.957+05:30',
        name: 'w2',
        numPartitions: 0,
        reportTopic: '',
        tasks: {}
      }
    };
    workflowWindowService.getWorkflowById(id).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(
      `/workflow/${id}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });

  it('delete workflow by id function', () => {
    const id = '5f1041eccfde330621602a1c';
    const dummyResponse = {
      status: true
    };
    workflowWindowService.deleteWorkflow(id).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(
      `/workflow/${id}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });

  it('execute workflow by id function', () => {
    const id = '5f1041eccfde330621602a1c';
    const dummyResponse = {
      status: true
    };
    workflowWindowService.executeWorkflow(id).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(
      `/workflow/execute/${id}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });

  it('test workflow by id function', () => {
    const id = '5f1041eccfde330621602a1c';
    const dummyResponse = {
      status: true
    };
    workflowWindowService.testWorkflow(id).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(
      `workflow/${id}/test-connection`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });
});
