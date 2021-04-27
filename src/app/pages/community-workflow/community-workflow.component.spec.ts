import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Input, Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconModule } from '@angular/material/icon';


import { of } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

import { CommunityWorkflowComponent } from './community-workflow.component';
import { MaterialModule } from '../shared/modules/material.module';


describe('CommunityWorkflowComponent', () => {
  @Component({
    selector: 'sapper-workflow-card',
    template: ''
  })
  class WorkflowCardComponentStub {
    @Input() workflowList;
    @Input() flexOptions;
    @Input() isCommunity;
    @Input() applicationFlexOptions;
    @Input() searchString;
  }

  let component: CommunityWorkflowComponent;
  let fixture: ComponentFixture<CommunityWorkflowComponent>;
  let workflowList = [
    {
      id: '1',
      name: 'Add attendees from completed webinar into Salesforce as Leads',
      description: 'Get the attendees with their information from Eventee and add attendee as a Lead ' +
      'into Salesforce.',
      applicationsUsed: [{ name: 'Eventee', logo: 'assets/images/Applications/event.png' },
      { name: 'Salesforce', logo: 'assets/images/Applications/sfdc.jpg' },
      { name: 'Slack', logo: 'assets/images/Applications/slack.png' },
      { name: 'Outlook', logo: 'assets/images/Applications/outlook.png' }],
      preview: '',
      type: 'My Workflow',
      failedJobs: 5,
      succeededJobs: 45,
      totalJobs: 50,
      avgTime: '2 min',
      tags: ['CRM', 'Sales']
    },
    {
      id: '2',
      name: 'Sync new event attendee from Eventee to account in Salesforce',
      description: 'Create a new account for attendee in Salesforce',
      applicationsUsed: [
        { name: 'Eventee', logo: 'assets/images/Applications/event.png' },
        { name: 'Salesforce', logo: 'assets/images/Applications/sfdc.jpg' }
      ],
      preview: '',
      type: 'My Workflow',
      failedJobs: 5,
      succeededJobs: 45,
      totalJobs: 50,
      avgTime: '2 min',
      tags: ['CRM', 'Sales']
    }];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityWorkflowComponent, WorkflowCardComponentStub],
      imports: [
        RouterTestingModule,
        MaterialModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MatIconModule,
        ToastrModule.forRoot()
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              apps: 'jira',
            })
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get filter name with ellipsis if name has more than 25 characters', () => {
    let filterName = 'jira';
    let filterLabel = component.getName(filterName);
    expect(filterLabel).toEqual('jira');

    filterName = 'Test name having more than 25 characters';
    filterLabel = component.getName(filterName);
    expect(filterLabel).toEqual('Test name having more tha...');
  });

  it('should hide or show the mattoltip', () => {
    let filterName = 'jira';
    let hideTooltip = component.isTooltipEnabled(filterName);
    expect(hideTooltip).toBeTruthy();

    filterName = 'Test name having more than 25 characters';
    hideTooltip = component.isTooltipEnabled(filterName);
    expect(hideTooltip).toBeFalsy();
  });

  it('should filter workflow cards according to selected applications filters', () => {
    let event = {
      checked: true
    };
    const data = 'jira';
    const index = 2;
    const type = 'app';
    component.filterChange(event, data, index, type);
    expect(component.appSelected.length).toEqual(2);
    expect(component.appSelected[0]).toEqual(data);
    event = {
      checked: false
    };
    component.filterChange(event, data, index, type);
    expect(component.appSelected.length).toEqual(1);
  });

  it('should filter workflow cards according to selected tags filters', () => {
    let event = {
      checked: true
    };
    const data = 'HR';
    const index = 0;
    const type = 'tag';
    component.filterChange(event, data, index, type);
    expect(component.tagSelected.length).toEqual(1);
    expect(component.tagSelected[0]).toEqual(data);
    event = {
      checked: false
    };
    component.filterChange(event, data, index, type);
    expect(component.tagSelected.length).toEqual(0);
  });
});
