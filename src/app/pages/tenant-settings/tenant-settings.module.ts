import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TenantSettingsComponent } from './tenant-settings.component';
import { MaterialModule } from '../shared/modules/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PasswordPolicyComponent } from './password-policy/password-policy.component';
import { UserConfigComponent } from './user-config/user-config.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [TenantSettingsComponent, PasswordPolicyComponent, UserConfigComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TenantSettingsModule { }
