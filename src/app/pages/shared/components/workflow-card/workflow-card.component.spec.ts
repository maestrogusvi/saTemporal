import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';

import { WorkflowCardComponent } from './workflow-card.component';
import { MaterialModule } from '../../modules/material.module';
import { WorkflowWindowService } from '../../../workflow/workflow-window/workflow-window.service';
import { UtilsService } from '../../utils.service';

describe('WorkflowCardComponent', () => {
  let component: WorkflowCardComponent;
  let fixture: ComponentFixture<WorkflowCardComponent>;
  let router: Router;
  let workflowWindowService: WorkflowWindowService;
  let utilsService: UtilsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowCardComponent ],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
        HttpClientTestingModule,
        MaterialModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowCardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    workflowWindowService = TestBed.inject(WorkflowWindowService);
    utilsService = TestBed.inject(UtilsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call navigateCard function', () => {
    let isCommunity = false;
    const selectedWorkflow = {
      id: '12345'
    };
    component.navigateCard(isCommunity, selectedWorkflow);
    isCommunity = true;
    const spy = spyOn(router, 'navigateByUrl');
    component.navigateCard(isCommunity, selectedWorkflow);
    const url = spy.calls.first().args[0];
    expect(url).toBe('/workflow/preview/12345');
  });

  it('should execute the workflow', () => {
    const data = 'some data';
    const id = '1234';
    const event = 'some event';
    spyOn(workflowWindowService, 'executeWorkflow').and.returnValue(of(data));
    const spyOnUtilsService = spyOn(utilsService, 'showSuccess').and.callThrough();
    const e = jasmine.createSpyObj('event', [ 'stopPropagation' ]);
    component.executeWorkflow(id , event);
    expect(spyOnUtilsService).toHaveBeenCalled();
    expect(e.stopPropagation).toHaveBeenCalled();
  });

  it('should get task list from the workflow', () => {
    const taskMap = {
      '12345': {
        id: '12345',
        name: 'ADP'
      }
    };
    const taskList = [{
      id: '12345',
      name: 'ADP'
    }];
    const testArray = component.getTaskList(taskList);
    expect(testArray).toEqual(taskList);
  });
});
