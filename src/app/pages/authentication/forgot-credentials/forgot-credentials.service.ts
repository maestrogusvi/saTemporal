import { Injectable } from '@angular/core';
import { UtilsService } from '../../shared/utils.service';

@Injectable({
  providedIn: 'root'
})
export class ForgotCredentialsService {

  constructor(
    private utilsService: UtilsService
  ) { }

  /**
   * To get new password
   * @param forgotPasswordObject
   */
  getNewPassword(forgotPasswordObject) {
    return this.utilsService.returnPostCall(`/user/forgot-password`, forgotPasswordObject);
  }
}
