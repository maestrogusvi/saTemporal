import { Component, OnInit, ChangeDetectorRef, AfterContentChecked, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { UtilsService } from '../../shared/utils.service';
import { IPasswordPolicy } from '../tenant-settings.interface';
import { PasswordPolicyService } from './password-policy.service';
import { TenantSettingsComponent } from '../tenant-settings.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'sapper-password-policy',
  templateUrl: './password-policy.component.html',
  styleUrls: ['./password-policy.component.scss']
})
export class PasswordPolicyComponent implements OnInit, AfterContentChecked {
  @Input() passwordConfig;
  passwordPolicyForm: FormGroup;
  passwordRegex: FormControl;
  regexMsg: FormControl;
  passwordLimit: FormControl;
  passwordExpiry: FormControl;
  lockoutTime: FormControl;
  lockoutAttempt: FormControl;

  passwordPolicies: IPasswordPolicy = {
    oldPasswordLimit: 0,
    passwordRegex: '',
    passwordErrorMessage: '',
    passwordExpiryDays: 0,
    failedAttemptTime: 0,
    failedAttemptLimit: 0,
    tenantName: ''
  };

  constructor(

    public translate: TranslateService,
    private utilsService: UtilsService,
    private cdref: ChangeDetectorRef,
    private passwordPolicyService: PasswordPolicyService,
    private parentDialogRef: MatDialogRef<TenantSettingsComponent>
  ) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.getDefaultPasswordPolicyConfig();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  createForm() {
    this.passwordPolicyForm = new FormGroup({
      passwordRegex: this.passwordRegex,
      regexMsg: this.regexMsg,
      passwordLimit: this.passwordLimit,
      passwordExpiry: this.passwordExpiry,
      lockoutAttempt: this.lockoutAttempt,
      lockoutTime: this.lockoutTime
    });
  }

  createFormControls() {
    this.passwordRegex = new FormControl(null, [Validators.required]);
    this.regexMsg = new FormControl(null);
    this.passwordLimit = new FormControl(null, [Validators.max(10)]);
    this.passwordExpiry = new FormControl(null);
    this.lockoutAttempt = new FormControl(null, [Validators.min(3), Validators.max(10)]);
    this.lockoutTime = new FormControl(null, [Validators.min(2), Validators.max(10)]);
  }

  getCompanyNameError() {

  }

  passwordPolicyConfig() {
    if (this.passwordPolicies.id) {
      this.passwordPolicyService.updatePasswordPolicy(this.passwordPolicies).subscribe(data => {
        this.utilsService.showSuccess('Password policies are updated successfully.', '');
        this.parentDialogRef.close();
      });
    } else {
      this.passwordPolicyService.savePasswordPolicy(this.passwordPolicies).subscribe(data => {
        this.utilsService.showSuccess('Password policies are saved successfully.', '');
      });
    }
  }

  getDefaultPasswordPolicyConfig() {
    this.passwordPolicyService.getDefaultPasswordPolicyConfig().subscribe(data => {
      this.passwordPolicies = data.data;
      const passwordLimit = this.passwordPolicyForm.get('passwordLimit');
      // passwordLimit.setValidators([Validators.pattern(this.defaultRegex.passwordRegex)]);
      // passwordLimit.updateValueAndValidity();

    });
  }
}
