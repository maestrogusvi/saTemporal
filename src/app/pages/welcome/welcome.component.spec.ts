import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { ToastrModule } from 'ngx-toastr';

import { WelComeComponent } from './welcome.component';
import { MaterialModule } from '../shared/modules/material.module';
import { MatIconModule } from '@angular/material/icon';


describe('WelComeComponent', () => {
  let component: WelComeComponent;
  let fixture: ComponentFixture<WelComeComponent>;
  let location: Location;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WelComeComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'welcome', component: WelComeComponent }
        ]),
        TableModule,
        ToastrModule.forRoot(),
        MaterialModule,
        MatIconModule
      ],
      providers: [TranslateService]
    }).compileComponents().then(() => {
      router = TestBed.inject(Router);
      httpTestingController = TestBed.inject(HttpTestingController);
      location = TestBed.inject(Location);
      fixture = TestBed.createComponent(WelComeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
