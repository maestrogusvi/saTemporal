import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationUsedComponent } from './application-used.component';

describe('ApplicationUsedComponent', () => {
  let component: ApplicationUsedComponent;
  let fixture: ComponentFixture<ApplicationUsedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationUsedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationUsedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
