import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { TranslateService } from '@ngx-translate/core';

import { IWorkflowData, IFlexOptions } from './workflow-listing.interface';
import { WorkflowDetailsDialogComponent } from './workflow-details-dialog/workflow-details-dialog.component';
import { WorkflowListingService } from './workflow-listing.service';
import { MessageService } from '../../shared/services/message.service';

@Component({
  selector: 'sapper-workflow-listing',
  templateUrl: './workflow-listing.component.html',
  styleUrls: ['./workflow-listing.component.scss']
})
export class WorkflowListingComponent implements OnInit {
  searchText: string;
  flexOptions: IFlexOptions = {
    layout: 'row wrap',
    layoutxs: 'column',
    layoutGap: '20px grid',
    layoutAlign: 'none',
    size: '33.3'
  };
  applicationFlexOptions: IFlexOptions = {
    layout: 'row wrap',
    layoutxs: 'column',
    layoutAlign: 'left none',
    layoutGap: '15px',
    size: '12%'
  };
  tagData = ['HR', 'Hiring', 'Employee Lifecycle', 'Contact', 'Technology'];
  allWorkflowsCopy = [];
  appSelected = [];
  tagSelected = [];
  workflowList: IWorkflowData[];

  @Output() openActiveWorkflow = new EventEmitter<any>();

  constructor(
    public translate: TranslateService,
    public router: Router,
    public dialog: MatDialog,
    readonly messageSevice: MessageService,
    private workflowListingService: WorkflowListingService
  ) {
    this.messageSevice.getMessage.subscribe((message) => {
      if (message && message.toLowerCase() === 'clone created') {
        this.workflowListingService.getWorkflowList().subscribe(data => {
          this.workflowList = data.data;
        });
        this.allWorkflowsCopy = this.workflowList;
      }
    });
  }

  ngOnInit(): void {
    this.workflowListingService.getWorkflowList().subscribe(data => {
      this.workflowList = data.data;
    });
    this.allWorkflowsCopy = this.workflowList;
  }

  /**
   * To open workflow details dialog component
   * @returns void
   */
  openWorkflowDetailsDialog(): void {
    const dialogRef = this.dialog.open(WorkflowDetailsDialogComponent, { width: '400px', disableClose: true });
    dialogRef.afterClosed().subscribe((data) => {
      this.messageSevice.setMessage('Automation Created');
      this.messageSevice.setWorkflowData(data);
      this.openActiveWorkflow.emit(data);
    });
  }
}
