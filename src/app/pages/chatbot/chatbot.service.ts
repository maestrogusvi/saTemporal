import { Injectable } from '@angular/core';
import { UtilsService } from '../shared/utils.service';

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {

  constructor(private utilsService: UtilsService) { }

  /**
   * execute workflow
   * @param any  scheduleObject
   */
  sendMessage(message) {
    return this.utilsService.returnPostCall(`/api`, message);
  }
}
