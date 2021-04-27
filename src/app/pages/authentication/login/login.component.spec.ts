import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { fakeAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { LineChartComponent } from '../../dashboard/create-charts/line-chart/line-chart.component';
import { SplineChartComponent } from '../../dashboard/create-charts/spline-chart/spline-chart.component';
import { ApplicationUsedComponent } from '../../dashboard/application-used/application-used.component';
import { BarChartComponent } from '../../dashboard/create-charts/bar-chart/bar-chart.component';
import { UtilsService } from '../../shared/utils.service';
import { CarouselComponent } from '../carousel/carousel.component';
import { MaterialModule } from '../../shared/modules/material.module';
import { LoginService } from './login.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let location: Location;
  let utilService: UtilsService;
  let loginService: LoginService;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginComponent,
        DashboardComponent,
        BarChartComponent,
        ApplicationUsedComponent,
        SplineChartComponent,
        LineChartComponent,
        CarouselComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: DashboardComponent },
          { path: 'login', component: LoginComponent }
        ]),
        TableModule,
        ToastrModule.forRoot(),
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [TranslateService]
    }).compileComponents().then(() => {
      router = TestBed.inject(Router)as Router;
      httpTestingController = TestBed.inject(HttpTestingController);
      utilService = TestBed.inject(UtilsService);
      loginService = TestBed.inject(LoginService);
      location = TestBed.inject(Location);
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call login()', () => {
    spyOn(component, 'login');
    const element = fixture.debugElement.query(By.css('button')).nativeElement;
    element.click();
    expect(component.login).toHaveBeenCalledTimes(1);
  });

  it('Should authenticate user', fakeAsync(() => {
    const userData = {
      username: 'admin@gmail.com',
      password: '12345',
    };
    const dummyResponse = {
      data: {
        authorization: 'auth_token'
      }
    };
    spyOn(loginService, 'login').and.returnValue(of(dummyResponse));
    const spyOnUtilsService = spyOn(utilService, 'setItemInSessionStorage').and.callThrough();
    component.login(userData);
    expect(spyOnUtilsService).toHaveBeenCalled();
    tick();
    expect(location.path()).toBe('/dashboard');
  }));
});
