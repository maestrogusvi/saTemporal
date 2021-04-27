import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedWidthParserComponent } from './fixed-width-parser.component';

describe('FixedWidthParserComponent', () => {
  let component: FixedWidthParserComponent;
  let fixture: ComponentFixture<FixedWidthParserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedWidthParserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedWidthParserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
