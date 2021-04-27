import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneAutomationComponent } from './clone-automation.component';

describe('CloneAutomationComponent', () => {
  let component: CloneAutomationComponent;
  let fixture: ComponentFixture<CloneAutomationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloneAutomationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneAutomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
