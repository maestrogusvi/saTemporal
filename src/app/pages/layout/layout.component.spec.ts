import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from '../shared/modules/material.module';
import { FooterComponent } from './footer/footer.component';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let translate: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LayoutComponent,
        HeaderComponent,
        FooterComponent
      ],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
        ToastrModule.forRoot()
      ]
    })
    .compileComponents();
    translate = TestBed.inject(TranslateService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    spyOn(translate, 'getBrowserLang').and.returnValue('');
    expect(component).toBeTruthy();
  });

  it('should load translations', async(() => {
    spyOn(translate, 'getBrowserLang').and.returnValue('');
    TestBed.createComponent(LayoutComponent);
 }));
});
