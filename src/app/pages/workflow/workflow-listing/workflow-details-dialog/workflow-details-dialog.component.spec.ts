import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { WorkflowDetailsDialogComponent } from './workflow-details-dialog.component';
import { MaterialModule } from '../../../shared/modules/material.module';
import { WorkflowListingService } from '../workflow-listing.service';
import { of } from 'rxjs';
import { UtilsService } from '../../../shared/utils.service';

describe('WorkflowDetailsDialogComponent', () => {
  let component: WorkflowDetailsDialogComponent;
  let fixture: ComponentFixture<WorkflowDetailsDialogComponent>;
  let workflowListingService: WorkflowListingService;
  let utilsService: UtilsService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        RouterTestingModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      declarations: [ WorkflowDetailsDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowDetailsDialogComponent);
    component = fixture.componentInstance;
    workflowListingService = TestBed.inject(WorkflowListingService);
    utilsService = TestBed.inject(UtilsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save Workflow', () => {
    const data ={data: {
      name: 'w1',
      description: 'test'
    }};
    spyOn(workflowListingService, 'saveWorkflow').and.returnValue(of(data));
    const spyOnUtilsService = spyOn(utilsService, 'showSuccess').and.callThrough();
    component.saveWorkflow();
    expect(spyOnUtilsService).toHaveBeenCalled();
  });
});
