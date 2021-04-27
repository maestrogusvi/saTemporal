import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { S3Component } from './s3.component';
import { MaterialModule } from '../../shared/modules/material.module';

describe('S3Component', () => {
  let component: S3Component;
  let fixture: ComponentFixture<S3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ S3Component ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MaterialModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(S3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
