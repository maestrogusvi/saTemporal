import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedWidthDialogComponent } from './fixed-width-dialog.component';

describe('FixedWidthDialogComponent', () => {
  let component: FixedWidthDialogComponent;
  let fixture: ComponentFixture<FixedWidthDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedWidthDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedWidthDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
