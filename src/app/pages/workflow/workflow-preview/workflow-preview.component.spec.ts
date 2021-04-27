import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowPreviewComponent } from './workflow-preview.component';
import { Component, Input } from '@angular/core';

describe('WorkflowPreviewComponent', () => {
  // @Component({
  //   selector: 'sapper-page-header',
  //   template: ''
  // })
  // class PageHeaderComponentStub {
  //   @Input() title;
  //   @Input() description;
  //   @Input() button;
  // }

  let component: WorkflowPreviewComponent;
  let fixture: ComponentFixture<WorkflowPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
