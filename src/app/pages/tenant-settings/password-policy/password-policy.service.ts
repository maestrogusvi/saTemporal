import { Injectable } from '@angular/core';
import { UtilsService } from '../../shared/utils.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordPolicyService {

  constructor(
    private utilsService: UtilsService
  ) { }

  savePasswordPolicy(passwordConfig) {
    return this.utilsService.returnPostCall(`password_policy`, passwordConfig);
  }

  updatePasswordPolicy(passwordConfig) {
    return this.utilsService.returnPostCall(`password_policy`, passwordConfig);
  }

  getDefaultPasswordPolicyConfig() {
    const tenantName = this.utilsService.getItemFromSessionStorage('tenant_name');
    return this.utilsService.returnGetCall(`password_policy/${tenantName}`);
  }
}
