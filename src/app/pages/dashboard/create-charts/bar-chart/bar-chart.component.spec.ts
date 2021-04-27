import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartComponent } from './bar-chart.component';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartComponent);
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
