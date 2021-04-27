import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { UserConfigService } from './user-config.service';

describe('UserConfigService', () => {
  let service: UserConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MatSnackBarModule
      ]
    });
    service = TestBed.inject(UserConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
