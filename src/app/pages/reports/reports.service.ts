import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilsService } from '../shared/utils.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private utilService: UtilsService) { }

  getExecutionHistory(): Observable<any> {
    return this.utilService.returnGetCall(`/execution-history`);
  }
}
