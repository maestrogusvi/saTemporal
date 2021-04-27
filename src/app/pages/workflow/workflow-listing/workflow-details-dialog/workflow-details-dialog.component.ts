import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { WorkflowListingService } from '../workflow-listing.service';
import { UtilsService } from '../../../shared/utils.service';
import { IWorkflow, IWorkflowPayload, IProcessProp } from '../../workflow.interface';

@Component({
  selector: 'sapper-workflow-details-dialog',
  templateUrl: './workflow-details-dialog.component.html',
  styleUrls: ['./workflow-details-dialog.component.scss'],
})
export class WorkflowDetailsDialogComponent implements OnInit {
  workflowDetails: IWorkflow = {
    name: '',
    description: '',
    reportTopic: 'Topic',
    numPartitions: 5,
    tasks: {},
  };

  processProp: IProcessProp = {
    name: '',
    documentation: '',
  };

  workflowPayload: IWorkflowPayload = {
    "process": {
      "processProp": this.processProp
    }
  };

  constructor(
    public dialogRef: MatDialogRef<WorkflowDetailsDialogComponent>,
    private workflowListingService: WorkflowListingService,
    private router: Router,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {}

  /**
   * To validate worflow name & description
   */
  validateWorkflowData() {
    return this.processProp.name;
  }

  /**
   * To save the workflow
   * @returns void
   */
  saveWorkflow(): void {
    this.workflowListingService
      .saveWorkflow(this.workflowPayload)
      .subscribe((data) => {
        this.utilsService.showSuccess('Automation created successfully!!', '');
        this.router.navigateByUrl(`/automation/edit/${data.data.id}`, { state: data.data });
        this.dialogRef.close(data.data);
      });
  }
}
