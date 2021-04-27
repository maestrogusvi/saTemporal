import { async, ComponentFixture, TestBed, tick, inject } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { fakeAsync } from '@angular/core/testing';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { ToastrModule } from 'ngx-toastr';

import { SignupComponent } from './signup.component';
import { UtilsService } from '../../shared/utils.service';
import { AuthComponent } from '../auth.component';
import { ThankYouComponent } from './../thank-you/thank-you.component';
import { MaterialModule } from '../../shared/modules/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let location: Location;
  let utilService: UtilsService;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SignupComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login/thank-you', component: ThankYouComponent },
          { path: 'signup', component: AuthComponent }
        ]),
        TableModule,
        ToastrModule.forRoot(),
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [TranslateService]
    }).compileComponents().then(() => {
      router = TestBed.inject(Router);
      httpTestingController = TestBed.inject(HttpTestingController);
      utilService = TestBed.inject(UtilsService);
      location = TestBed.inject(Location);
      fixture = TestBed.createComponent(SignupComponent);
      component = fixture.componentInstance;
      fixture.autoDetectChanges();
    });
  }));

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('Validations', () => {
    const form = component.signupForm;
    expect(form.valid).toEqual(false);

    // Company name is required
    expect(form.get('companyName').valid).toEqual(false);
    form.get('companyName').setValue('TomTom');
    expect(form.get('companyName').valid).toEqual(true);

    // Name is required
    expect(form.get('name').valid).toEqual(false);
    form.get('name').setValue('Madhuri');
    expect(form.get('name').valid).toEqual(true);
    expect(form.valid).toEqual(false);

    // Email name is required
    expect(form.get('email').valid).toEqual(false);
    form.get('email').setValue('madhuri@tomtom.com');
    expect(form.get('email').valid).toEqual(true);

    // Password is required
    expect(form.get('password').valid).toEqual(false);
    form.get('password').setValue('Admin@123');
    expect(form.get('password').valid).toEqual(true);

    // Confirm Password is required
    expect(form.get('confirmPassword').valid).toEqual(false);
    form.get('confirmPassword').setValue('Admin@123');
    expect(form.get('confirmPassword').valid).toEqual(true);

    expect(form.valid).toEqual(true);
  });

  it('should call signup()', inject([Router], () => {
    component.signupForm.setValue({
      companyName: 'Abc',
      name: 'xyz',
      email: 'Abc@gmail.com',
      password: 'Admin@123',
      confirmPassword: 'Admin@123',
    });
    const spy = spyOn(router, 'navigateByUrl');
    component.signup();
    const url = spy.calls.first().args[0];
    expect(url).toBe('/thank-you');
  }));

  xit('positive test case for signup method ', fakeAsync(() => {
    const dummyResponse = {
      data: {
        authorization: 'auth_token'
      }
    };
    component.signup();
    const req = httpTestingController.expectOne(
      'rest/api/signup'
    );
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse); // to set response
    fixture.detectChanges();
    httpTestingController.verify();
    tick();
    expect(location.path()).toBe('/thank-you');
  }));

  // it('validate password', () => {
  //   component.signupForm.setValue({
  //     companyName: 'Abc',
  //     name: 'xyz',
  //     email: 'Abc@gmail.com',
  //     password: '',
  //     confirmPassword: 'Admin@123',
  //   });
  //   component.signup();
  //   expect(component.password.errors.required).toBe(true);
  //   expect(component.getPasswordError()).toEqual('Password is required.');

  //   const form = component.signupForm;
  //   form.get('password').setValue('admin@121212');
  //   component.signup();
  //   expect(component.password.errors.pattern).toBeTruthy();
  //   expect(component.getPasswordError())
  //   .toEqual('A password has to be eight characters including one uppercase letter, one special character and alphanumeric characters.');

  //   form.get('password').setValue('Admin121212');
  //   component.signup();
  //   expect(component.password.errors.pattern).toBeTruthy();
  //   expect(component.getPasswordError())
  //   .toEqual('A password has to be eight characters including one uppercase letter, one special character and alphanumeric characters.');

  //   form.get('password').setValue('Admin@fdgf');
  //   component.signup();
  //   expect(component.password.errors.pattern).toBeTruthy();
  //   expect(component.getPasswordError())
  //   .toEqual('A password has to be eight characters including one uppercase letter, one special character and alphanumeric characters.');

  //   form.get('password').setValue('Ad@1');
  //   expect(component.password.errors.pattern).toBeTruthy();
  //   expect(component.getPasswordError())
  //   .toEqual('A password has to be eight characters including one uppercase letter, one special character and alphanumeric characters.');

  //   form.get('password').setValue('Ad@1eqweqwewewqewqewqewqewq');
  //   expect(component.password.errors.maxlength).toBeTruthy();
  //   expect(component.password.errors.pattern).toBeFalsy();
  //   expect(component.getPasswordError()).toEqual('Password cannot not be more than 20 characters.');

  //   form.get('password').setValue('Admin@123');
  //   component.signup();
  //   expect(component.getPasswordError()).toEqual(undefined);
  // });

  // it('validate confirm password', () => {
  //   component.signupForm.setValue({
  //     companyName: 'Abc',
  //     name: 'xyz',
  //     email: 'Abc@gmail.com',
  //     password: 'Admin@123',
  //     confirmPassword: '',
  //   });
  //   component.signup();
  //   expect(component.confirmPassword.errors.required).toBe(true);
  //   expect(component.getConfirmPasswordError()).toEqual('Confirm password is required.');

  //   const form = component.signupForm;
  //   form.get('password').setValue('Pooja');
  //   form.get('confirmPassword').setValue('Admin');
  //   component.signup();
  //   expect(component.confirmPassword.errors.equalTo).toBeTruthy();
  //   expect(component.getConfirmPasswordError()).toEqual('Password does not match.');

  //   form.get('password').setValue('Admin@123');
  //   form.get('confirmPassword').setValue('Admin@123');
  //   component.signup();
  //   expect(component.getConfirmPasswordError()).toEqual(undefined);
  // });

  it('validate Company name', () => {
    const form = component.signupForm;
    expect(component.getCompanyNameError()).toEqual('Company name is required.');

    form.get('companyName').setValue('Ab');
    expect(component.companyName.errors.minlength).toBeTruthy();
    expect(component.getCompanyNameError()).toEqual('Please enter atleast 3 character.');

    form.get('companyName').setValue('Company name should not be greater than 50 characters.');
    expect(component.companyName.errors.maxlength).toBeTruthy();
    expect(component.getCompanyNameError()).toEqual('Company name cannot be more than 50 characters.');

    form.get('companyName').setValue('Sapper');
    expect(component.getCompanyNameError()).toEqual(undefined);
  });

  it('validate Admin name', () => {
    const form = component.signupForm;
    expect(component.getAdminNameError()).toEqual('Admin name is required.');

    form.get('name').setValue('Ab');
    expect(component.name.errors.minlength).toBeTruthy();
    expect(component.getAdminNameError()).toEqual('Please enter atleast 3 character.');

    form.get('name').setValue('Admin name should not be greater than 50 characters.');
    expect(component.name.errors.maxlength).toBeTruthy();
    expect(component.getAdminNameError()).toEqual('Admin name cannot be more than 50 characters.');

    form.get('name').setValue('SapperAdmin');
    expect(component.getAdminNameError()).toEqual(undefined);
  });

  it('validate Email address', () => {
    const form = component.signupForm;
    expect(component.email.errors.required).toBeTruthy();
    expect(component.getEmailError()).toEqual('Email is required.');

    form.get('email').setValue('adminsome');
    expect(component.email.errors.pattern).toBeTruthy();
    expect(component.getEmailError()).toEqual('Enter valid email address.');

    form.get('email').setValue('admin@someassdsadsadasdassasxzczxcxza@gmail.com');
    expect(component.email.errors.maxlength).toBeTruthy();
    expect(component.getEmailError()).toEqual('Email cannot be more than 50 characters.');

    form.get('email').setValue('admin@gmail.com');
    expect(component.getEmailError()).toEqual(undefined);
  });
});
