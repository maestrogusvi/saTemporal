import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { AppStoreService } from './app-store.service';
import { MaterialModule } from '../shared/modules/material.module';

describe('AppStoreService', () => {
  let service: AppStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MaterialModule
      ]
    });
    service = TestBed.inject(AppStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
