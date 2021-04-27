import { Injectable } from '@angular/core';
import { UtilsService } from '../shared/utils.service';

@Injectable({
  providedIn: 'root'
})
export class MappingService {

  constructor(private utilsService: UtilsService) { }

  /**
   * To delete connection
   * @param id: string
   */
  deleteMapping(mappingId) {
    return this.utilsService.returnDeleteCall(`/data-mapper/${mappingId}`);
  }

  getMappingById(mappingId) {
    return this.utilsService.returnGetCall(`/data-mapper/${mappingId}`);
  }

  createMapping(mappingData) {
    return this.utilsService.returnPostCall(`/data-mapper`, mappingData);
  }

  updateMapping(mappingData) {
    return this.utilsService.returnPutCall(`/data-mapper`, mappingData);
  }
}
