import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { WorkflowHeaderComponent } from './workflow-header.component';
import { MaterialModule } from '../../shared/modules/material.module';

describe('WorkflowHeaderComponent', () => {
  let component: WorkflowHeaderComponent;
  let fixture: ComponentFixture<WorkflowHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkflowHeaderComponent],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        MaterialModule
      ],
      providers: [
        { provide: Router, useValue: Router }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it('should call adjustZoom', () => {
  //   expect(component.zoomVal).toBe(100);
  //   component.adjustZoom('inc');
  //   expect(component.zoomVal).toBe(110);

  //   component.adjustZoom('desc');
  //   expect(component.zoomVal).toBe(100);

  //   component.adjustZoom('desc');
  //   expect(component.zoomVal).toBe(90);
  // });
});
