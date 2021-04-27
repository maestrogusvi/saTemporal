import { Injectable } from '@angular/core';
import { UtilsService } from '../shared/utils.service';
import { IApplicationNode } from './app-store.interface';

@Injectable({
  providedIn: 'root'
})
export class AppStoreService {

  constructor(
    private utilsService: UtilsService
  ) { }

  /**
   * To get all application
   */
  getAllApplications() {
    return this.utilsService.returnGetCall(`/application`);
  }

  getAllApplicationsLov() {
    return this.utilsService.returnGetCall(`/application/lov`);
  }
}
