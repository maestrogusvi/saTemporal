import { Injectable } from '@angular/core';
import { UtilsService } from '../../shared/utils.service';

@Injectable({
  providedIn: 'root'
})
export class CloneAutomationService {

  constructor(private utilsService: UtilsService) { }
  

  validateAutomationName(automationName) {
    return this.utilsService.returnGetCall(`/workflow/copy/${automationName}`);
  }
  saveAutomationName(automationData){
    return this.utilsService.returnPostCall(`/workflow/copy`,automationData);

  }
}
