import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TenantSettingsService } from './tenant-settings.service';
import { UtilsService } from '../shared/utils.service';
import { IPasswordPolicy } from './tenant-settings.interface';
import { PasswordPolicyService } from './password-policy/password-policy.service';
import { PasswordPolicyComponent } from './password-policy/password-policy.component';

@Component({
  selector: 'sapper-tenant-settings',
  templateUrl: './tenant-settings.component.html',
  styleUrls: ['./tenant-settings.component.scss']
})
export class TenantSettingsComponent implements OnInit {
  @ViewChild(PasswordPolicyComponent)passwordConfig;
  // passwordConfig: IPasswordPolicy = {
  //   oldPasswordLimit: 0,
  //   passwordRegex: '',
  //   passwordErrorMessage: '',
  //   passwordExpiryDays: 0,
  //   failedAttemptTime: 0,
  //   failedAttemptLimit: 0,
  //   tenantName: ''
  // };

  options = [
    { option: 'Disable Schedule', field: 'disable_schedule' },
    { option: 'Password Policy', field: 'password_policy' },
    { option: 'User Config', field: 'user_config' }
  ];
  settings = { disable_schedule: true };
  opened = true;
  showPasswordPolicy = true;
  showUserConfig = false;
  ShowSchedule = false;
  selectedOption = {
    option: 'Password Policy',
    field: 'password_policy'
  };
  constructor(
    public dialogRef: MatDialogRef<TenantSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public tenantSettingsService: TenantSettingsService,
    public utilService: UtilsService,
    private passwordPolicyService: PasswordPolicyService) { }

  ngOnInit(): void { }

  // close dialog box
  closeDialog(): void {
    this.dialogRef.close();
  }

  /**
   * Used to update tenant level schedule settings
   * @param  {any} option
   * @returns void
   */
  updateSchedule(option): void {
    this.settings[option.field] = !this.settings[option.field];
    const tenantId = '123';
    if (this.settings[option.field]) {
      this.tenantSettingsService.disableTenantSchedule(tenantId).subscribe((message) => {
        this.utilService.showSuccess(this.utilService.fetchResponseData(message), '');
        this.closeDialog();
      });
    } else {
      this.tenantSettingsService.enableTenantSchedule(tenantId).subscribe((message) => {
        this.utilService.showSuccess(this.utilService.fetchResponseData(message), '');
        this.closeDialog();
      });
    }
  }
}
