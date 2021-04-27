import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  getConnectionListing() {
    return this.utilsService.returnGetCall(API.SERVER + API.API + API.ROLEMAPPING);
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

  getSecurityRoleListing() {
    return this.utilsService.returnGetCall(API.SERVER + API.API + API.STSECURITYROLE);
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
