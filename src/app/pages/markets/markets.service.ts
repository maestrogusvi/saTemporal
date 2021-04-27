import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UtilsService } from '../shared/utils.service';
import {API} from '../../constants/api';

@Injectable({
  providedIn: 'root'
})
export class MarketsService {

  constructor(private utilsService: UtilsService, private httpClient: HttpClient) { }

  testConnection(connectionData) {
  }

  /**
   * To get connection listing
   */
  getConnectionListing(mkg) {
    return this.utilsService.returnGetCall(API.SERVER + API.API + API.MARKET + mkg);
  }
  deleteConnection(id: string) {
    return this.utilsService.returnDeleteCall(`/connection/${id}`);
  }
  getGrpRoles() {
    return this.utilsService.returnGetCall(API.SERVER + API.API + API.GRPROLE);
  }

  getBrandsListing() {
    return this.utilsService.returnGetCall(API.SERVER + API.API + API.BRANDS);
  }

  getCountriesListining() {
    return this.utilsService.returnGetCall(API.SERVER + API.API + API.COUNTRIES);
  }


  getMarketGroupIds() {
    return this.utilsService.returnGetCall(API.SERVER + API.API + API.MARKETGROUPSID);
  }
  postRoleMapping(data: any) {
    return this.utilsService.returnPostCall(API.SERVER + API.API + API.MARKET, data);
  }

  putRoleMapping(data: any) {
    return this.utilsService.returnPutCall(API.SERVER + API.API + API.MARKET, data);
  }

  deleteRoleMapping(roleMappingId: any) {
    return this.utilsService.returnDeleteCall(API.SERVER + API.API + API.MARKET + roleMappingId);
  }

}
