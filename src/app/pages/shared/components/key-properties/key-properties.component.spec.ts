import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyPropertiesComponent } from './key-properties.component';

describe('PageHeaderComponent', () => {
  let component: KeyPropertiesComponent;
  let fixture: ComponentFixture<KeyPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KeyPropertiesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
