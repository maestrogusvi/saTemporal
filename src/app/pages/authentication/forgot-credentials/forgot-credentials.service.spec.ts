import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TranslateModule } from '@ngx-translate/core';

import { ForgotCredentialsService } from './forgot-credentials.service';
import { ToastrModule } from 'ngx-toastr';

describe('ForgotCredentialsService', () => {
  let service: ForgotCredentialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ]
    });
    service = TestBed.inject(ForgotCredentialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
