import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HotkeyModule } from 'angular2-hotkeys';

import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { WorkflowComponent } from './workflow.component';
import { MaterialModule } from '../shared/modules/material.module';

describe('WorkflowComponent', () => {
  let component: WorkflowComponent;
  let fixture: ComponentFixture<WorkflowComponent>;
  let router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowComponent ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot(),
        MaterialModule,
        RouterTestingModule,
        HotkeyModule.forRoot()
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    spyOn(router, 'getCurrentNavigation').and.returnValue({ extras: { state: { id: '1111'} } });
    fixture = TestBed.createComponent(WorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
