import { Injectable } from '@angular/core';
import { UtilsService } from '../../shared/utils.service';
import { ISaveTaskProperties } from '../workflow.interface';

@Injectable({
  providedIn: 'root'
})
export class PropertiesPanelService {

  constructor(private utilsService: UtilsService) { }

  /**
   * To save the task properties
   * @param taskProperties: ISaveTaskProperties
   */
  saveTaskProperties(taskProperties: ISaveTaskProperties) {
    return this.utilsService.returnPostCall(`/task-properties`, taskProperties);
  }

  /**
   * To save the soap task properties
   * @param soaptaskProperties: ISaveTaskProperties
   */
  saveSOAPTaskProperties(soaptaskProperties: any) {
    return this.utilsService.returnPostCall(`/task-properties`, soaptaskProperties);
  }

  /**
   * To update the task properties
   * @param taskProperties: ISaveTaskProperties
   */
  updateTaskProperties(taskProperties: ISaveTaskProperties) {
    return this.utilsService.returnPutCall(`/task-properties`, taskProperties);
  }

  updateSOAPTaskProperties(soaptaskProperties: any) {
    return this.utilsService.returnPutCall(`/task-properties`, soaptaskProperties);
  }
  /**
   * To get the task properties by Id
   * @param taskId: string
   */
  getTaskProperties(taskId: string) {
    return this.utilsService.returnGetCall(`/task-properties/${taskId}`);
  }
}
