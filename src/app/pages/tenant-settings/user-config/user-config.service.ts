import { Injectable } from '@angular/core';
import { UtilsService } from '../../shared/utils.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserConfigService {

  constructor(public router: Router, private utilService: UtilsService) { }

  /**
   * used to get all users for specific tenant
   * @param string  tenantName
   */
  getUsersByTenantName(tenantName) {
    return this.utilService.returnGetCall(`/users/${tenantName}`);
  }

  /**
   * used to update user status
   * @param any  user
   */
  updateUsersByTenantName(user) {
    return this.utilService.returnPutCall(`/user`, user);
  }
}
