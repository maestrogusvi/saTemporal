import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMessageDialogComponent } from './show-message-dialog.component';
import { MaterialModule } from '../../shared/modules/material.module';

describe('ShowMessageDialogComponent', () => {
  let component: ShowMessageDialogComponent;
  let fixture: ComponentFixture<ShowMessageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowMessageDialogComponent ],
      imports: [
        MaterialModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
