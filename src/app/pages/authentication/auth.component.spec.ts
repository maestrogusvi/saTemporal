import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { ToastrModule } from 'ngx-toastr';

import { LoginComponent } from '../authentication/login/login.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LineChartComponent } from '../dashboard/create-charts/line-chart/line-chart.component';
import { SplineChartComponent } from '../dashboard/create-charts/spline-chart/spline-chart.component';
import { ApplicationUsedComponent } from '../dashboard/application-used/application-used.component';
import { BarChartComponent } from '../dashboard/create-charts/bar-chart/bar-chart.component';
import { CarouselComponent } from './carousel/carousel.component';
import { SignupComponent } from './signup/signup.component';
import { AuthComponent } from './auth.component';
import { MaterialModule } from '../shared/modules/material.module';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuthComponent,
        LoginComponent,
        DashboardComponent,
        BarChartComponent,
        ApplicationUsedComponent,
        SplineChartComponent,
        LineChartComponent,
        CarouselComponent,
        SignupComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent },
          { path: 'signup', component: SignupComponent }
        ]),
        TableModule,
        ToastrModule.forRoot(),
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [TranslateService]
    }).compileComponents().then(() => {
      location = TestBed.inject(Location);
      fixture = TestBed.createComponent(AuthComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call gotoUrl()', () => {
    spyOn(component, 'gotoUrl');
    const element = fixture.debugElement.query(By.css('button')).nativeElement;
    element.click();
    expect(component.gotoUrl).toHaveBeenCalled();
  });

  it('positive test case for gotoUrl method', () => {
    component.gotoUrl('/login');
    fixture.detectChanges();
    expect(component.rightPanel).toEqual(false);
    expect(location.path()).toBe('/login');
  });

  it('positive test case for setAnimationType method', fakeAsync(() => {
    component.setAnimationType();
    spyOn(component, 'setAnimationType');
    setTimeout(() => {
      expect(component.setAnimationType).toHaveBeenCalled();
    }, 5000);
    tick(10000);
  }));
});
