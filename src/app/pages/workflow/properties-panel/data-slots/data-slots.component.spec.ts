import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSlotsComponent } from './data-slots.component';

describe('DataSlotsComponent', () => {
  let component: DataSlotsComponent;
  let fixture: ComponentFixture<DataSlotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSlotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
