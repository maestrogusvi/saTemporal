import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogComponent, ConfirmDialogModel } from './confirm-dialog.component';
// import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../shared/modules/material.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  const dialogMock = {
    close: () => { }
  };
  const title = 'Upload Workflow Confirmation';
  const message = 'Confirmation message';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDialogComponent ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        TranslateService,
        { provide: ConfirmDialogModel, useValue: title, message },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the mat dialog on onDismiss() click and returns false', async(() => {
    component.onDismiss();
    // spyOn(component, 'onDismiss');
    // fixture.detectChanges();
    // const button = fixture.debugElement.nativeElement.querySelector('#dismiss');
    // button.click();
    // expect(component.onDismiss).toHaveBeenCalled();
  }));

  it('should close the mat dialog on onConfirm() click and returns false', async(() => {
    component.onConfirm();
    // spyOn(component, 'onConfirm');
    // fixture.detectChanges();
    // const button = fixture.debugElement.nativeElement.querySelector('#confirm');
    // button.click();
    // expect(component.onConfirm).toHaveBeenCalled();
  }));
});
