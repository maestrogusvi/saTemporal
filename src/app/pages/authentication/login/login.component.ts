import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { IUserData } from './login.interface';
import { LoginService } from './login.service';
import { UtilsService } from '../../shared/utils.service';

@Component({
  selector: 'sapper-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public userData: IUserData = {
    email: '',
    password: ''
  };

  component: { username: any; };
  public rightPanel: boolean;
  hidePassword = true;
  constructor(
    public formBuilder: FormBuilder,
    public loginService: LoginService,
    public router: Router,
    public translate: TranslateService,
    private utilService: UtilsService
  ) { }


  /**
   * Authentication
   * @param userData: IUserData
   * @returns void
   */
  login(userData: IUserData): void {
    if (this.userData.email && this.userData.password) {
      this.loginService.login(userData).subscribe(data => {
        this.utilService.setItemInSessionStorage('auth_token', data.data.token);
        this.utilService.setItemInSessionStorage('tenant_name', 'test');
        this.utilService.setItemInSessionStorage('atk11', data.data.superAdmin);
        this.utilService.setItemInSessionStorage('first_time_login', '');
       // data.data.authentication.firstTimeLogin || data.data.authentication.passwordExpired ? this.router.navigateByUrl('/reset-password') :
        this.router.navigateByUrl('/welcome');
      });
    } else {
      this.utilService.setItemInSessionStorage('auth_token', ' ');
      this.utilService.setItemInSessionStorage('tenant_name', 'test1');
      this.utilService.setItemInSessionStorage('first_time_login', ' ');
    }
  }
}
