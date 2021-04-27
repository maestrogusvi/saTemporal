import { Component, EventEmitter, Output, Input } from '@angular/core';
import { UtilsService } from '../../shared/utils.service';
import { WorkflowService } from '../workflow.service';
import { MatDialog } from '@angular/material/dialog';
import { WorkflowDetailsDialogComponent } from '../workflow-listing/workflow-details-dialog/workflow-details-dialog.component';
import { MessageService } from '../../shared/services/message.service';



@Component({
  selector: 'sapper-workflow-header',
  templateUrl: './workflow-header.component.html',
  styleUrls: ['./workflow-header.component.scss'],
})
export class WorkflowHeaderComponent {
  activeWorkflow: any;
  workflowWindowList = [];
  tempWindowCount = 0;

  @Input() set currentWorkflow(currentWorkflow) {
    if (currentWorkflow) {
      if (this.workflowWindowList.findIndex(item => item.id === currentWorkflow.id) === -1) {
        this.workflowWindowList.push(currentWorkflow);
      }
      this.activeWorkflow = currentWorkflow;
    }
  }
  @Output() openActiveWorkflow = new EventEmitter<any>();
  @Output() closeClickedWorkflow = new EventEmitter<any>();
  @Output() autoArrange = new EventEmitter<string>();
  @Output() saveWorkflow = new EventEmitter<string>();
  @Output() uploadJsonFile = new EventEmitter<string>();
  @Output() clearCanvas = new EventEmitter<string>();
  @Output() testWorkflow = new EventEmitter<string>();
  @Output() downloadWorkflowJson = new EventEmitter<string>();
  @Output() deleteWorkflow = new EventEmitter<string>();
  @Output() executeWorkflow = new EventEmitter<string>();

  constructor(
    public workflowService: WorkflowService,
    public utilService: UtilsService,
    public dialog: MatDialog,
    readonly messageSevice: MessageService
  ) { }

  /**
   * Used to add new tab for creating new workflow
   * @returns void
   */
  addNewTab(): void {
    const dialogRef = this.dialog.open(WorkflowDetailsDialogComponent, { width: '400px', disableClose: true });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.messageSevice.setMessage('Workflow Created');
        this.workflowWindowList.push(data);
        this.openActiveWorkflow.emit(data);
      }
    });
  }

  /**
   * Used to emit current workflow json to the parent component
   * @param window
   * @returns void
   */
  openWorkflow(window): void {
    this.openActiveWorkflow.emit(window);
  }

  /**
   * Used to close clicked workflow window
   * @param number index
   * @returns void
   */
  closeWindow(workflowId, index): void {
    this.getCurrentTabAfterCloseTab(index);
    this.workflowWindowList.splice(index, 1);
    (this.workflowWindowList.length === 0) ? this.openActiveWorkflow.emit(false) : this.openActiveWorkflow.emit(this.activeWorkflow);
    this.closeClickedWorkflow.emit(workflowId);
  }

  /**
   * Used to get next workflow window after current was closed
   * @param number 
   * @returns void
   */
  getCurrentTabAfterCloseTab(i): void {
    this.activeWorkflow = this.workflowWindowList[i + 1] ? this.workflowWindowList[i + 1] : this.workflowWindowList[i - 1];
  }
 

}
