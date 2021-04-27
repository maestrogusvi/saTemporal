import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { HeaderComponent } from './header.component';
import { HttpLoaderFactory } from '../../../app.module';
import { MaterialModule } from '../../shared/modules/material.module';
import { MccColorPickerModule } from 'material-community-components';

const TRANSLATIONS_EN = require('./../../../../assets/i18n/en.json');
const TRANSLATIONS_FR = require('./../../../../assets/i18n/fr.json');

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let http: HttpTestingController;
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MccColorPickerModule,
        ToastrModule.forRoot()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have the hamburger menu open', async () => {
    const menu = fixture.nativeElement.parentNode.querySelector('.mat-menu-panel');
    expect(menu).toBeFalsy();
  });

  it('open the menu when clicking on the hamburger button', async () => {
    const hamburgerMenu = fixture.debugElement.nativeElement.querySelector('.hamburgerMenu div');
    hamburgerMenu.click();
    const menu = fixture.nativeElement.parentNode.querySelector('.mat-menu-panel');
    expect(menu).toBeTruthy();
    expect(fixture.debugElement.queryAll(By.css('.mat-menu-content .menu-item')).length).toEqual(2);
  });

  it('should check text of first menu when hamburger menu is open', async () => {
    const hamburgerMenu = fixture.debugElement.nativeElement.querySelector('.hamburgerMenu div');
    hamburgerMenu.click();
    const menu = fixture.nativeElement.parentNode.querySelector('.mat-menu-panel');
    expect(menu).toBeTruthy();
    const ele = fixture.debugElement.queryAll(By.css('.mat-menu-content .menu-item:first-child'));
    expect(ele[0].nativeElement.textContent).toEqual('MAIN-HEADER.CHANGE-LANGUAGE');
    expect(ele).toBeTruthy();
  });

  it('should check with default lang english', async () => {
    const hamburgerMenu = fixture.debugElement.nativeElement.querySelector('.hamburgerMenu div');
    hamburgerMenu.click();
    const menu = fixture.nativeElement.parentNode.querySelector('.mat-menu-panel');
    expect(menu).toBeTruthy();
    const ele = fixture.debugElement.queryAll(By.css('.mat-menu-content .menu-item:first-child'));
    http.expectOne('/assets/i18n/en.json').flush(TRANSLATIONS_EN);
    http.expectNone('/assets/i18n/fr.json');
    http.verify();
    fixture.detectChanges();
    expect(ele[0].nativeElement.textContent).toEqual(TRANSLATIONS_EN['MAIN-HEADER']['CHANGE-LANGUAGE']);
  });

  it('should change language to french', async () => {
    const hamburgerMenu = fixture.debugElement.nativeElement.querySelector('.hamburgerMenu div');
    hamburgerMenu.click();
    const menu = fixture.nativeElement.parentNode.querySelector('.mat-menu-panel');
    expect(menu).toBeTruthy();
    const ele = fixture.debugElement.queryAll(By.css('.mat-menu-content .menu-item:first-child'));

    http.expectOne('/assets/i18n/en.json').flush(TRANSLATIONS_EN);
    http.expectNone('/assets/i18n/fr.json');
    component.changeLang('fr');

    http.expectOne('/assets/i18n/fr.json').flush(TRANSLATIONS_FR);
    http.expectNone('/assets/i18n/en.json');
    http.verify();
    fixture.detectChanges();

    // verify result
    expect(ele[0].nativeElement.textContent).toEqual(TRANSLATIONS_FR['MAIN-HEADER']['CHANGE-LANGUAGE']);
    expect(ele[0].nativeElement.textContent).not.toEqual(TRANSLATIONS_EN['MAIN-HEADER']['CHANGE-LANGUAGE']);

  });

  it('should redirect to login page', async(() => {
    const spy = spyOn(router, 'navigateByUrl');
    component.logout();
    const url = spy.calls.first().args[0];
    expect(url).toBe('/login');
  }));

  it('should call onFileChange when input is changed for required files', () => {
    const mockFileReader = {
      result: '',
      readAsDataURL: (blobInput) => {
          console.log('readAsDataURL');
      },
      onloadend: () => {
          console.log('onloadend');
      }
    };
    const event = {
      target: {
        files: [
          {
            lastModified: '1583905787437',
            lastModifiedDate: 'Wed Mar 11 2020 11:19:47 GMT+0530 (India Standard Time) {}',
            name: 'gmail.png',
            size: 2350,
            type: 'image/png',
            webkitRelativePath: ''
          }
        ]
      }
    };

    spyOn<any>(window, 'FileReader').and.returnValue(mockFileReader);
    spyOn<any>(mockFileReader, 'readAsDataURL').and.callFake((blobInput) => {
      mockFileReader.result = 'data:image/png;base64,iVBOR';
      mockFileReader.onloadend();
    });
    spyOn(component, 'onFileChange').and.callThrough();
    component.onFileChange(event);
    expect(component.onFileChange).toHaveBeenCalled();
  });

  it('should call saveImage() and close popup', () => {
    spyOn(component, 'openModal').and.callThrough();
    const button = fixture.debugElement.queryAll(By.css('.mat-menu-content .menu-item.change-logo'));
    expect(button).toBeTruthy();
    expect(document.querySelector('h4.dialog-title')).toBeNull();
    component.openModal(component.uploadTemplate);

    component.tempImage = 'data:image/png;base64';
    const values = {
      buttonColor: '#50667D',
      buttonTextColor: '#30943C',
      headerActive: '#2929a5',
      headerTextColor: '#464646',
      headerTheme: '#9600FF'
    };
    component.saveImage(values);
    fixture.detectChanges();
    expect(component.logoPath).toEqual(component.tempImage);
    expect(document.documentElement.style.getPropertyValue('--header-text-color')).toEqual('#464646');
    expect(document.documentElement.style.getPropertyValue('--button-text-color')).toEqual('#30943C');
    expect(document.documentElement.style.getPropertyValue('--button-color')).toEqual('#50667D');
    expect(document.documentElement.style.getPropertyValue('--header-theme-color')).toEqual('#9600FF');
    expect(document.documentElement.style.getPropertyValue('--header-active-color')).toEqual('#2929a5');
  });
});
