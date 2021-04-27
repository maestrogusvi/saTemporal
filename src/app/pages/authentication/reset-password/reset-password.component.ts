import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';

import { IResetPassword } from '../auth.interface';
import { ResetPasswordService } from './reset-password.service';
import { UtilsService } from '../../shared/utils.service';

@Component({
  selector: 'sapper-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  currentPassword: FormControl;
  newPassword: FormControl;
  confirmPassword: FormControl;
  defaultRegex = {
    passwordRegex: '',
    passwordErrorMessage: ''
  };
  hidePassword = true;
  resetPasswordData: IResetPassword = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  resetTextFlag;
  constructor(
    private resetPasswordService: ResetPasswordService,
    public router: Router,
    private utilsService: UtilsService,
    private activatedRoute: ActivatedRoute,
    public location: Location
  ) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.getDefaultPasswordConfigByTenantName();
    this.resetTextFlag = this.utilsService.getItemFromSessionStorage('first_time_login');
  }

  getTitle(): string {
    if (this.activatedRoute.snapshot.routeConfig.path === 'change-password') {
      this.resetTextFlag = 'false';
      return 'Change Password';
    }
    return 'Reset Password';
  }

  getBtnLabel(): string {
    if (this.activatedRoute.snapshot.routeConfig.path === 'change-password') {
      return 'Change';
    }
    return 'Reset';
  }

  /**
   * To reset password
   * @param resetPasswordData: IResetPassword
   * @returns void
   */
  resetPassword(resetPasswordData: IResetPassword): void {
    this.resetPasswordService.resetPassword(resetPasswordData).subscribe(data => {
      // TODO: data manipulation
      if (data.status) {
        this.utilsService.showSuccess('Reset password successfully', '');
        // this.utilsService.setItemInSessionStorage('auth_token', '');
        if (this.activatedRoute.snapshot.routeConfig.path === 'change-password') {
          this.logout();
        } else {
          this.router.navigateByUrl('/welcome');
        }
      }
    });
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
  }

  getDefaultPasswordConfigByTenantName() {
    const tenantName = this.utilsService.getItemFromSessionStorage('tenant_name');
    this.resetPasswordService.getDefaultConfigByTenant(tenantName).subscribe(data => {
      this.defaultRegex.passwordRegex = data.data.passwordRegex;
      this.defaultRegex.passwordErrorMessage = data.data.passwordErrorMessage;
      const password = this.resetPasswordForm.get('newPassword');
      if (this.defaultRegex.passwordRegex.length > 0) {
        password.setValidators([Validators.pattern(this.defaultRegex.passwordRegex)]);
        password.updateValueAndValidity();
      }
    });
  }

  /**
   * This function is used for define the structure of signup form.
   */
  createForm() {
    this.resetPasswordForm = new FormGroup({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    });
  }


  // checkPasswords(): ValidatorFn {
  //   return (group: FormGroup): ValidationErrors => {
  //     const control1 = group.controls['newPassword'];
  //     const control2 = group.controls['myControl2'];
  //     if (control1.value !== control2.value) {
  //         control2.setErrors({notEquivalent: true});
  //     } else {
  //         control2.setErrors(null);
  //     }
  //     return;
  //   };
  // }
  /**
   * Added rules and validations to control
   */
  createFormControls() {
    this.currentPassword = new FormControl(null, [
      Validators.required
    ]);
    this.newPassword = new FormControl(null, [
      Validators.required,
    ]);
    this.confirmPassword = new FormControl(null, [
      Validators.required,
    ]);
  }

  checkPasswords() {
    const newPassword = this.resetPasswordForm.get('newPassword');
    const confirmPassword = this.resetPasswordForm.get('confirmPassword');
    return newPassword.value === confirmPassword.value ? null : 'Password should match with the new password.';
  }


  getPatternMsg(): string {
    if (this.defaultRegex && this.defaultRegex.passwordRegex) {
      return this.defaultRegex.passwordErrorMessage;
    }
    return 'A password must be eight characters including one uppercase letter, one special character and alphanumeric characters.'
  }
}
