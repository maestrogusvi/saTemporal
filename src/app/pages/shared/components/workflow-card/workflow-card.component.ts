import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { WorkflowWindowService } from '../../../workflow/workflow-window/workflow-window.service';
import { UtilsService } from '../../utils.service';
import { WorkflowService } from '../../../../pages/workflow/workflow.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../../workflow/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CloneAutomationComponent } from 'src/app/pages/workflow/clone-automation/clone-automation.component';


@Component({
  selector: 'sapper-workflow-card',
  templateUrl: './workflow-card.component.html',
  styleUrls: ['./workflow-card.component.scss']
})
export class WorkflowCardComponent implements OnInit {
  @Input() workflowList;
  @Input() flexOptions;
  @Input() isCommunity;
  @Input() applicationFlexOptions;
  @Input() searchString;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    private workflowWindowService: WorkflowWindowService,
    private utilsService: UtilsService,
    private utilService: UtilsService,
    public workflowService: WorkflowService,
  ) {
  }

  ngOnInit(): void {
  }

  /**
   * To navigate on card click
   * @param type: boolean
   * @param selectedWorkflow: any
   * @returns void
   */
  navigateCard(type, selectedWorkflow): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        data: selectedWorkflow
      }
    };
    if (type) {
      // if card is of community workflow
      this.router.navigateByUrl(`/automation/preview/${selectedWorkflow.id}`, navigationExtras);
    } else {
      this.router.navigateByUrl(`/automation/edit/${selectedWorkflow.id}`);
    }
  }

  /**
   * To execute workflow
   * @param id: string
   * @param event: any
   */
  executeWorkflow(id, event): void {
    this.workflowWindowService.executeWorkflow(id).subscribe(data => {
      this.utilsService.showSuccess('Automation executed successfully', '');
    });
    event.stopPropagation();
  }

  getTaskList(tasksMap) {
    if (tasksMap) {
      return Object.values(tasksMap);
    }
  }

  deleteWorkflow(workflowId) {
    const message =
      ' Are you sure you want to delete this automation?';
    const dialogData = new ConfirmDialogModel(
      'Delete Automation Confirmation',
      message,
      true
    );
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.workflowWindowService.deleteWorkflow(workflowId).subscribe(data => {
          this.workflowList.splice(this.workflowList.findIndex(workflow => {
            return workflow.id === workflowId;
          }), 1);
          this.utilService.showSuccess('Automation is deleted.', '');
        });
      }
    });
  }

  cloneWorkflow(workflowId){
    this.dialog.open(CloneAutomationComponent, { width: '400px', disableClose: true , data: workflowId });
  }

}
