import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { SignupService } from './signup.service';
import { MaterialModule } from '../../shared/modules/material.module';

describe('SignupService', () => {
  let signupService: SignupService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule,
      TranslateModule.forRoot(),
      HttpClientTestingModule,
      ToastrModule.forRoot(),
      MaterialModule
    ]
  }).compileComponents().then(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    signupService = TestBed.inject(SignupService);
  }));


  it('should be created', () => {
    expect(SignupService).toBeTruthy();
  });

  it('signup function', () => {
    const signupData = {
      email: 'madhuri@gmail.com',
      companyName: 'Digitalcues',
      name: 'Madhuri Kadam',
      contact: '9878675643',
      password: 'Admin@123',
      confirmPassword: 'Admin@123'
    };

    const dummyResponse = {
      data: {
        authorization: 'auth_token1'
      }
    };
    signupService.signup(signupData).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(
      'rest/api/signup'
    );
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });
});
