import { Injectable } from '@angular/core';
import { IWorkflow } from '../workflow.interface';
import { UtilsService } from '../../shared/utils.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkflowWindowService {

  public workflowUpdated = false;
  public metaId = '';
  constructor(private utilsService: UtilsService) { }
  /**
   * To save the workflow
   * @param workflowObject: IWorkflow
   * @returns any
   */
  saveWorkflow(workflowObject: IWorkflow): any {
    return this.utilsService.returnPostCall(`/workflow`, workflowObject);
  }

  /**
   * To update the workflow
   * @param workflowObject: IWorkflow
   * @returns: any
   */
  updateWorkflow(workflowObject): any {
    return this.utilsService.returnPutCall(`/workflow`, workflowObject);
  }

  /**
   * To get the workflow by id
   * @param id: string
   * @returns any
   */
  getWorkflowById(id): any {
    return this.utilsService.returnGetCall(`/workflow/${id}`);
  }


  /**
   * To delete workflow
   * @param id: string
   */
  deleteWorkflow(id) {
    return this.utilsService.returnDeleteCall(`/workflow/${id}`);
  }

  /**
   * To execute the workflow
   * @param id: string
   */
  executeWorkflow(id): any {
    return this.utilsService.returnGetCall(`/workflow/execute/${id}`);
  }

  testWorkflow(id) {
    return this.utilsService.returnGetCall(`workflow/${id}/test-connection`);
  }

  cloneWorkflow(workflowdetails:any){
    return this.utilsService.returnGetCall(`workflow/copy/${workflowdetails}`);
  }

    /** Export worflow/automation
   * 
   */
  exportWorkflow(workflowId){
     return this.utilsService.returnGetCall(`/workflow/export?workflowId=${workflowId}`);
   }

}
