import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpSinkComponent } from './tp-sink.component';

describe('TpSinkComponent', () => {
  let component: TpSinkComponent;
  let fixture: ComponentFixture<TpSinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpSinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpSinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
