import { Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from '../../shared/services/message.service';
import { UtilsService } from '../../shared/utils.service';
import { WorkflowListingService } from '../workflow-listing/workflow-listing.service';
import { ICloneAutomation, IProcessProp, IWorkflowPayload } from '../workflow.interface';
import { CloneAutomationService } from './clone-automation.service';

@Component({
  selector: 'sapper-clone-automation',
  templateUrl: './clone-automation.component.html',
  styleUrls: ['./clone-automation.component.scss']
})
export class CloneAutomationComponent {
  automation: ICloneAutomation = { workflowName: '', workflowId: '' };
  isSaveEnable = false;

  constructor(public dialogRef: MatDialogRef<CloneAutomationComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private workflowListingService: WorkflowListingService,
    private router: Router,
    private utilsService: UtilsService,
    private automationService: CloneAutomationService,
    readonly messageSevice: MessageService) {
  }
 /** For the save button disable  */

  validateWorkflowCloneData():boolean {
    return this.automation.workflowName && this.isSaveEnable;

  }
 /** Function for the validate button. */
  validateAutomation():void{
    this.automation.workflowName = this.automation.workflowName.trim();
    this.automationService.validateAutomationName(this.automation.workflowName).subscribe((response) => {
      this.isSaveEnable = response.data;
    });
  }
/** Function for the save button. */
  saveAutomation():void {
    this.automation.workflowId = this.data;
    this.automationService.saveAutomationName(this.automation).subscribe((response)=>{
      this.messageSevice.setMessage('Clone created');
      this.dialogRef.close(false);
    });
  }





}

