import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { MaterialModule } from './pages/shared/modules/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {

  // translate is a alias of TranslateService
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let translate: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        ToastrModule.forRoot(),
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [HttpClient, TranslateService]
    }).compileComponents();
    translate = TestBed.inject(TranslateService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * For translation
   * There is no tag in template so no expect statement here
   */
  it('should create', () => {
    spyOn(translate, 'getBrowserLang').and.returnValue('');
    expect(component).toBeTruthy();
  });

  it('should load translations', async(() => {
    spyOn(translate, 'getBrowserLang').and.returnValue('');
    TestBed.createComponent(AppComponent);
 }));
});
