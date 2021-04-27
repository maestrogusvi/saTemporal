import { Injectable } from '@angular/core';
import { UtilsService } from '../shared/utils.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private utilsService: UtilsService

  ) { }

  getDashboardDetails() {
    return this.utilsService.returnGetCall(`/dashboard`);
  }
}
