import { Injectable } from '@angular/core';
import { UtilsService } from '../../shared/utils.service';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(
    private utilsService: UtilsService
  ) { }


  /**
   * To reset the password
   * @param resetPasswordObject
   */
  resetPassword(resetPasswordObject) {
    return this.utilsService.returnPostCall(`/user/reset-password`, resetPasswordObject);
  }


  getDefaultConfigByTenant(tenantName) {
    return this.utilsService.returnGetCall(`/password_policy/default/${tenantName}`);
  }
}
