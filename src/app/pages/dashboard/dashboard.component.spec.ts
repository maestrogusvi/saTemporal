import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TableModule } from 'primeng/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { DashboardComponent } from './dashboard.component';
import { BarChartComponent } from './create-charts/bar-chart/bar-chart.component';
import { LineChartComponent } from './create-charts/line-chart/line-chart.component';
import { SplineChartComponent } from './create-charts/spline-chart/spline-chart.component';
import { ApplicationUsedComponent } from './application-used/application-used.component';
import { MaterialModule } from '../shared/modules/material.module';
import { Component, Input } from '@angular/core';

describe('DashboardComponent', () => {
  // @Component({
  //   selector: 'sapper-page-header',
  //   template: ''
  // })
  // class PageHeaderComponentStub {
  //   @Input() title;
  //   @Input() description;
  //   @Input() button;
  // }

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        BarChartComponent,
        LineChartComponent,
        SplineChartComponent,
        ApplicationUsedComponent,
        // PageHeaderComponentStub
      ],
      imports: [
        TableModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MaterialModule
      ],
      providers: [TranslateService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
