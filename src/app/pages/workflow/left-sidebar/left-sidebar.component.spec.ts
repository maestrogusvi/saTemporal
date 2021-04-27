import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { LeftSidebarComponent } from './left-sidebar.component';
import { MaterialModule } from '../../shared/modules/material.module';

describe('LeftSidebarComponent', () => {
  let component: LeftSidebarComponent;
  let fixture: ComponentFixture<LeftSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftSidebarComponent ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MaterialModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should clear search text', () => {
    component.searchApp = 'pooja';
    component.clearSearch();
    expect(component.searchApp).toEqual('');
  });

  it('it should hide tab', () => {
    component.displayTab = 'core';
    component.hideTab();
    expect(component.displayTab).toEqual('');
  });

  it('should open tab from left panel', () => {
    let tabname = '';
    component.openCloseTab(tabname);
    expect(component.displayTab).not.toEqual(undefined);

    tabname = 'core';
    component.openCloseTab(tabname);
    expect(component.displayTab).toEqual('core');

    component.searchApp = 'logical';
    component.openCloseTab(tabname);
    expect(component.displayTab).toEqual('');
    expect(component.searchApp).toEqual('');
  });

  it('should call addNodeActive()', () => {
    component.displayTab = '';
    component.addNodeActive();
    expect(component.displayTab).toEqual('app');

    spyOn(component, 'shakeMe').and.callThrough();
    component.displayTab = 'core';
    component.addNodeActive();
    expect(component.shakeMe).toHaveBeenCalled();
  });

  it('should call shakeEnd()', () => {
    spyOn(component, 'shakeEnd').and.callThrough();
    component.shakeEnd('shakeend');
    expect(component.shakeEnd).toHaveBeenCalled();
  });
});
