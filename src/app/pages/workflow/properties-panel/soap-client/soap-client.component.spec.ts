import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoapClientComponent } from './soap-client.component';

describe('SoapClientComponent', () => {
  let component: SoapClientComponent;
  let fixture: ComponentFixture<SoapClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoapClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoapClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
