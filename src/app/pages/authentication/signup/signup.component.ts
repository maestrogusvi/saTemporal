import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { CustomValidators } from 'ngx-custom-validators';

import { SignupService } from './signup.service';
import { UtilsService } from '../../shared/utils.service';
import { IRegisterUser } from '../auth.interface';

@Component({
  selector: 'sapper-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterContentChecked {

  signupForm: FormGroup;
  passwordForm: FormGroup;
  name: FormControl;
  email: FormControl;
  companyName: FormControl;
  password: FormControl;
  confirmPassword: FormControl;
  isMasked: boolean;
  phoneNumber: FormControl;
  domain: FormControl;
  domainName: FormControl;

  selectedDomain = {
    prefix: '',
    suffix: ''
  };
  userDetails: IRegisterUser = {
    companyName: '',
    adminName: '',
    businessEmail: '',
    tenantName: '',
    contactNumber: '',
    domain: ''
  };

  constructor(
    public signupService: SignupService,
    public router: Router,
    public translate: TranslateService,
    private utilsService: UtilsService,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  /**
   * This function is used for define the structure of signup form.
   */
  createForm() {
    this.signupForm = new FormGroup({
      email: this.email,
      companyName: this.companyName,
      name: this.name,
      phoneNumber: this.phoneNumber,
      domain: this.domain,
      domainName: this.domainName
    });
  }

  /**
   * Added rules and validations to control
   */
  createFormControls() {
    this.domain = new FormControl({value: '', disabled: true});
    this.domainName = new FormControl(null, [
      Validators.required]);
    this.companyName = new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)]);
    this.name = new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30)]);
    this.email = new FormControl(null, [
      Validators.required,
      Validators.pattern('[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$'),
      Validators.maxLength(30)]);
    this.phoneNumber = new FormControl(null, [
      Validators.required,
      Validators.pattern('^[1-9]{1}[0-9]{9}$'),
      Validators.maxLength(10)]);
    // this.password = new FormControl(null, [
    //   Validators.required,
    //   Validators.maxLength(20),
    //   Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]);
    // this.confirmPassword = new FormControl(null, CustomValidators.equalTo(this.password));
  }

  /**
   * Used to return error message for company name control
   * @returns string
   */
  getCompanyNameError(): string | void {
    if (this.companyName.errors) {
      if (this.companyName.errors.required) {
        return 'Company name is required.';
      } else if (this.companyName.errors.minlength) {
        return 'Please enter atleast 3 character.';
      } else {
        return 'Company name cannot be more than 50 characters.';
      }
    }
  }

  /**
   * Used to return error message for name control
   * @returns string
   */
  getAdminNameError(): string | void {
    if (this.name.errors) {
      if (this.name.errors.required) {
        return 'Admin name is required.';
      } else if (this.name.errors.minlength) {
        return 'Please enter atleast 3 character.';
      } else {
        return 'Admin name cannot be more than 50 characters.';
      }
    }
  }

  /**
   * Used to return error message for email control
   * @returns string
   */
  getEmailError(): string | void {
    if (this.email.errors) {
      if (this.email.errors.required) {
        return 'Email is required.';
      } else if (this.email.errors.pattern) {
        return 'Enter valid email address.';
      } else {
        return 'Email cannot be more than 50 characters.';
      }
    }
  }

  getPhoneNumberError(): string | void {
    if (this.phoneNumber.errors) {
      if (this.phoneNumber.errors.required) {
        return 'Contact number is required.';
      } else if (this.phoneNumber.errors.pattern) {
        return 'Enter valid contact number.';
      } else {
        return 'Contact number cannot be more than 10 digits.';
      }
    }
  }

  /**
   * Used to return error message for password control
   * @returns string
   */
  // getPasswordError(): string | void {
  //   if (this.password.errors) {
  //     if (this.password.errors.required) {
  //       return 'Password is required.';
  //     } else if (this.password.errors.pattern) {
  //       return 'A password has to be eight characters including one uppercase letter, one special character and alphanumeric characters.';
  //     } else {
  //       return 'Password cannot not be more than 20 characters.';
  //     }
  //   }
  // }
  /**
   * Used to return error message for confirm password control
   * @returns string
   */
  // getConfirmPasswordError(): string | void {
  //   if (this.confirmPassword.errors) {
  //     if (this.confirmPassword.errors.required) {
  //       return 'Confirm password is required.';
  //     } else {
  //       return 'Password does not match.';
  //     }
  //   }
  // }

  /**
   * To register new user
   * @returns void
   */
  signup(): void {
    this.userDetails.domain = `${this.selectedDomain.prefix}-${this.selectedDomain.suffix}`;
    this.signupService.signup(this.userDetails).subscribe(data => {
      this.router.navigateByUrl('/thank-you');
    });
  }

  onBlurEvent() {
    this.selectedDomain.prefix =  this.userDetails.businessEmail.split('@').pop().split('.')[0];
  }

}
