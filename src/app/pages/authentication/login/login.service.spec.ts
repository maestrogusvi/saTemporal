import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { LoginService } from './login.service';
import { IUserData } from './login.interface';

describe('LoginService', () => {
  const userObject: IUserData[] = [{
      username: 'abc@gmail.com',
      password: '12345'
    }, {
      username: 'admin@gmail.com',
      password: '12345'
    }
  ];
  let loginService: LoginService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      MatSnackBarModule,
      RouterTestingModule,
      TranslateModule.forRoot(),
      HttpClientTestingModule,
      ToastrModule.forRoot()
    ]
  }).compileComponents().then(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    loginService = TestBed.inject(LoginService);
  }));


  it('should be created', () => {
    expect(loginService).toBeTruthy();
  });

  it('login function', () => {
    const selectedUser: IUserData = {
      username: 'abc@gmail.com',
      password: '12345'
    };
    const dummyResponse = {
      data: {
          authorization: 'auth_token1'
      }
    };
    loginService.login(selectedUser).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(
      '/authenticate'
    );
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });
});
