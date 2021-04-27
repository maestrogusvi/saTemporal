import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { IFlexOptions } from '../workflow/workflow-listing/workflow-listing.interface';
import { IApplicationNode } from '../app-store/app-store.interface';
import { AppStoreService } from '../app-store/app-store.service';
import { appData } from './../../../assets/common.variable';

@Component({
  selector: 'sapper-community-workflow',
  templateUrl: './community-workflow.component.html',
  styleUrls: ['./community-workflow.component.scss']
})
export class CommunityWorkflowComponent implements OnInit {
  // appData: IApplicationNode[];
  appData = appData;
  flexOptions = {
    layout: 'row wrap',
    layoutxs: 'column',
    layoutGap: '20px grid',
    layoutAlign: 'space-between none',
    size: '50'
  };

  applicationFlexOptions: IFlexOptions = {
    layout: 'row wrap',
    layoutxs: 'column',
    layoutAlign: 'left none',
    layoutGap: '5px',
    size: '10%'
  };

  workflowList = [
    {
      id: '1',
      name: 'Add attendees from completed webinar into Salesforce as Leads',
      description: 'Get the attendees with their information from Eventee and add attendee as a Lead ' +
        'into Salesforce.',
      applicationsUsed: [{ name: 'Eventee', logoPath: 'assets/images/Applications/event.png' },
      { name: 'Salesforce', logoPath: 'assets/images/Applications/sfdc.jpg' },
      { name: 'Slack', logoPath: 'assets/images/Applications/slack.png' },
      { name: 'Outlook', logoPath: 'assets/images/Applications/outlook.png' }],
      preview: '',
      type: 'My Workflow',
      failedJobs: 5,
      succeededJobs: 45,
      totalJobs: 50,
      avgTime: '2 min',
      tags: ['CRM', 'Sales', 'Notification']
    },
    {
      id: '2',
      name: 'Sync new/updated issue from Jira to Zendesk',
      description: 'Sapper creates a new ticket or update existing ticket in Zendesk as pee Jira changes.',
      applicationsUsed: [{ name: 'Jira', logoPath: 'assets/images/Applications/jira.png' },
      { name: 'Zendesk', logoPath: this.appData[33].logoPath }],
      preview: '',
      type: 'Community Workflow',
      failedJobs: 5,
      succeededJobs: 45,
      totalJobs: 50,
      avgTime: '2 min',
      tags: ['Customer Service', 'Tracking']
    },
    {
      id: '3',
      name: 'Sync new event attendee from Eventee to account in Salesforce',
      description: 'Create a new account for attendee in Salesforce',
      applicationsUsed: [
        { name: 'Eventee', logoPath: 'assets/images/Applications/event.png' },
        { name: 'Salesforce', logoPath: 'assets/images/Applications/sfdc.jpg' }
      ],
      preview: '',
      type: 'My Workflow',
      failedJobs: 5,
      succeededJobs: 45,
      totalJobs: 50,
      avgTime: '2 min',
      tags: ['CRM', 'Sales']
    },
    {
      id: '4',
      name: 'New/Updated Jira Issue will create/update ServiceNow Incident with attachments (Real - Time)',
      description: 'New/Updated Jira Issue will create/update ServiceNow Incident with attachments (Real - Time)',
      // applicationsUsed : ['Jira', 'ServiceNow', 'Slack', 'HTTP'],
      applicationsUsed: [
        { name: 'ServiceNow', logoPath: this.appData[3].logoPath },
        { name: 'Jira', logoPath: 'assets/images/Applications/jira.png' },
        { name: 'Slack', logoPath: 'assets/images/Applications/slack.png' },
        { name: 'HTTP', logoPath: 'assets/images/core/http.jpg' }],
      preview: '',
      type: 'Community Workflow',
      failedJobs: 5,
      succeededJobs: 45,
      totalJobs: 50,
      avgTime: '2 min',
      tags: ['ITSM', 'Tracking']
    }
  ];
  appSelected = [];
  searchDomain = '';
  allWorkflowsCopy = [];
  tagSelected = [];
  tagData = ['HR', 'Hiring', 'Employee Lifecycle', 'Contact', 'Technology'];

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private appStoreService: AppStoreService) {
    this.getApplicationList();
  }

  ngOnInit(): void {
    this.allWorkflowsCopy = this.workflowList;
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.apps) {
          this.appSelected = params.apps.split(',');
          this.appData.forEach((app, index) => {
            app.checked = this.appSelected.indexOf(app.name) > -1;
            this.moveElemArray(this.appData, index, 0);
          });
          this.filterWorkflow();
        }
      });
  }

  /**
   *
   * @param name > 25 characters then show ellipse
   */
  getName(name) {
    if (name.length > 25) {
      return `${name.substring(0, 25)}...`;
    }
    return name;
  }

  /**
   *
   * @param name > 25 show material tooltip
   */
  isTooltipEnabled(name) {
    if (name.length > 25) {
      return false;
    }
    return true;
  }

  /**
   *
   * @param app filter all applications and workflow data when removed app
   */
  filterChange(event, data: string, index: number, type) {
    let toPosition = event.checked ? 0 : this.tagData.length - 1;
    if (type === 'app') {
      toPosition = event.checked ? 0 : this.appData.length - 1;
      this.appData = this.moveElemArray(this.appData, index, toPosition);
      if (toPosition === 0) {
        this.appSelected.push(data);
      } else {
        const poss = this.appSelected.indexOf(data);
        this.appSelected.splice(poss, 1);
      }
    } else {
      this.tagData = this.moveElemArray(this.tagData, index, toPosition);
      if (toPosition === 0) {
        this.tagSelected.push(data);
      } else {
        const poss = this.tagSelected.indexOf(data);
        this.tagSelected.splice(poss, 1);
      }
    }
    this.filterWorkflow();
  }

  private moveElemArray(array, from, to) {
    return array.map((item, i) =>
      i === to ? array[from] : (i >= Math.min(from, to) && i <= Math.max(from, to) ? array[i + Math.sign(to - from)] : item)
    );
  }

  /**
   * filter workflow data based on application selection
   */
  private filterWorkflow(): void {
    const workflows = this.allWorkflowsCopy;
    this.workflowList = workflows.filter(obj => {
      if (this.tagSelected.every(ai => obj.tags.includes(ai))) {
        return obj;
      }
      return false;
    });
    this.workflowList = this.workflowList.filter(obj => {
      if (this.appSelected.every(ai => obj.applicationsUsed.find(app => app.name === ai))) {
        return obj;
      }
      return false;
    });
  }


  /**
   * To get all applications
   * @returns void
   */
  private getApplicationList(): void {
    this.appStoreService.getAllApplications().subscribe(data => {
      this.appData = data.data;
    });
  }

}
