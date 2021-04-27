import { Component, OnInit } from '@angular/core';

import { IFlexOptions } from '../workflow-listing/workflow-listing.interface';

@Component({
  selector: 'sapper-workflow-preview',
  templateUrl: './workflow-preview.component.html',
  styleUrls: ['./workflow-preview.component.scss']
})
export class WorkflowPreviewComponent implements OnInit {
  selectedWorkflow;
  applicationFlexOptions: IFlexOptions = {
    layout: 'row wrap',
    layoutxs: 'column',
    layoutAlign: 'left none',
    size: '12%',
    layoutGap: '10px'
  };

  buttonObject = {
    title: 'Use this Automation'
  };

  constructor() { }

  ngOnInit(): void {

    this.selectedWorkflow = {
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
      tags: ['CRM', 'Sales'],
      usersCount: 100,
      working: '<ol><li> Get attendees registration in Eventee.</li>' +
      '<li> Get attendees information from Eventee.</li>' +
      '<li> Search for Lead based on attendee information. </li>' +
      '<li> If Lead is found then update the Lead in Salesforce. </li>' +
      '<li> Create the attendee as a Lead in Salesforce if not already in there.</li>' +
      '<li> Notify team on Slack.</li>' +
      '<li> Notify team on Outlook.</ol>'
    };
  }

}
