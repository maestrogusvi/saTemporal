import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplineChartComponent } from './spline-chart.component';

describe('LineChartComponent', () => {
  let component: SplineChartComponent;
  let fixture: ComponentFixture<SplineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
