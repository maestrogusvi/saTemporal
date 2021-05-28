import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import { UtilsService } from '../shared/utils.service';
import { IRoleMapping } from './role-mapping.interface';
import {API} from '../../constants/api';

@Injectable({
  providedIn: 'root'
})
export class RoleMappingService {

  constructor(private utilsService: UtilsService, private httpClient: HttpClient) { }

  testConnection(connectionData) {
  }

  /**
   * To get connection listing
   */
  getConnectionListing(mkg) {
    const params = new HttpParams()
      .set('marketGroupId', mkg);
    return this.utilsService.returnGetCall(API.SERVER + API.API + API.ROLEMAPPING + '?' + params.toString());
  }
  deleteConnection(id: string) {
    return this.utilsService.returnDeleteCall(`/connection/${id}`);
  }
  getGrpRoles(marketGroupId, brand) {
    return this.utilsService.returnGetCall(API.SERVER + API.API + API.GRPROLE + '/' + marketGroupId + '/' + brand);
  }

  getBrandsListing() {
    return this.utilsService.returnGetCall(API.SERVER + API.API + API.BRANDS);
  }

  getSecurityRoleListing(marketGroupId, brand) {
    return this.utilsService.returnGetCall(API.SERVER + API.API + API.STSECURITYROLE + '/' + marketGroupId + '/' + brand);
  }

  getMarketGroupIds() {
    return this.utilsService.returnGetCall(API.SERVER + API.API + API.MARKETGROUPSID);
  }
  postRoleMapping(data: any) {
    return this.utilsService.returnPostCall(API.SERVER + API.API + API.POSTROLEMAPPING, data);
  }

  putRoleMapping(data: any) {
    return this.utilsService.returnPutCall(API.SERVER + API.API + API.POSTROLEMAPPING, data);
  }

  deleteRoleMapping(roleMappingId: any) {
    return this.utilsService.returnDeleteCall(API.SERVER + API.API + API.DELETEROLEMAPPING + roleMappingId);
  }

}
