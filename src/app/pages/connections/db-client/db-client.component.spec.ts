import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbClientComponent } from './db-client.component';

describe('DbClientComponent', () => {
  let component: DbClientComponent;
  let fixture: ComponentFixture<DbClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
