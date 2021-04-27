import { Component, OnInit } from '@angular/core';
import { ForgotCredentialsService } from './forgot-credentials.service';
import { IForgotPassword } from '../auth.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'sapper-forgot-credentials',
  templateUrl: './forgot-credentials.component.html',
  styleUrls: ['./forgot-credentials.component.scss']
})
export class ForgotCredentialsComponent implements OnInit {
  forgotPasswordData: IForgotPassword = {
    businessEmail: ''
  };
  constructor(
    private forgotCredentialsService: ForgotCredentialsService,
    public router: Router

  ) { }

  ngOnInit() {
  }

  /**
   * To get new password
   * @param forgotPasswordData:IForgotPassword
   * @returns void
   */
  getNewPassword(forgotPasswordData: IForgotPassword): void {
    this.forgotCredentialsService.getNewPassword(forgotPasswordData).subscribe(data => {
      // TODO: data mogification
    });
  }
}
