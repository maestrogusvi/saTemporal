import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartComponent } from './line-chart.component';

describe('LineChartComponent', () => {
  let component: LineChartComponent;
  let fixture: ComponentFixture<LineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show weekly chart', () => {
    component.showChartWeekly();
    expect(component.selectedFilter).toEqual('weekly');
  });

  it('should show monthly chart', () => {
    component.showChartMonthly();
    expect(component.selectedFilter).toEqual('monthly');
  });

  it('should show daily chart', () => {
    component.showChartDailyBasis();
    expect(component.selectedFilter).toEqual('last7days');
  });
});
