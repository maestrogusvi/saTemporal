import { Injectable } from '@angular/core';
import { UtilsService } from 'src/app/pages/shared/utils.service';

@Injectable({
  providedIn: 'root'
})
export class SqlClientService {

  constructor(private utilsService: UtilsService) { }

  /**
   * to validate query
   * @param query: string
   */
  validateQuery(query: string): any {
    return this.utilsService.returnGetCall(`sql-properties/validate?query=${query}`);
  }
}
