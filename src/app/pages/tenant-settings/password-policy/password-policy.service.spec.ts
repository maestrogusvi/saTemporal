import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { PasswordPolicyService } from './password-policy.service';

describe('PasswordPolicyService', () => {
  let service: PasswordPolicyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(PasswordPolicyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
