import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { ThankYouComponent } from './thank-you.component';


describe('ThankYouComponent', () => {
  let component: ThankYouComponent;
  let fixture: ComponentFixture<ThankYouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ThankYouComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'thank-you', component: ThankYouComponent }
        ]),
        ToastrModule.forRoot()
      ],
      providers: [TranslateService]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(ThankYouComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
