import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { Component, Input, Output } from '@angular/core';

import { ToastrModule } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { WorkflowListingComponent } from './workflow-listing.component';
import { MaterialModule } from '../../shared/modules/material.module';

describe('WorkflowListingComponent', () => {
  @Component({
    selector: 'sapper-workflow-card',
    template: ''
  })
  class WorkflowCardComponentStub {
    @Input() workflowList;
    @Input() flexOptions;
    @Input() isCommunity;
    @Input() applicationFlexOptions;
    @Input() searchString;
  }

  @Component({
    selector: 'sapper-page-header',
    template: ''
  })
  class PageHeaderComponentStub {
    @Input() title;
    @Input() description;
    @Input() button;
  }

  let component: WorkflowListingComponent;
  let fixture: ComponentFixture<WorkflowListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WorkflowListingComponent,
        PageHeaderComponentStub,
        WorkflowCardComponentStub
      ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        MatDialogModule,
        MaterialModule
      ],
      providers: [TranslateService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
