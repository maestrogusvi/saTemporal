import { Injectable } from '@angular/core';
import { IWorkflow, IWorkflowPayload } from '../workflow.interface';
import { UtilsService } from '../../shared/utils.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowListingService {

  constructor(private utilsService: UtilsService) { }

  /**
   * To save the workflow
   * @param workflowObject: IWorkflow
   * @returns any
   */
  saveWorkflow(workflowObject: IWorkflowPayload): any {
    return this.utilsService.returnPostCall(`/workflow`, workflowObject);
  }

  /**
   * To get workflow list
   * @returns any
   */
  getWorkflowList(): any {
    return this.utilsService.returnGetCall(`/workflow`);
  }
}
