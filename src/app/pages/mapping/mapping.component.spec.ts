import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingComponent } from './mapping.component';
import { UtilsService } from '../shared/utils.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('MappingComponent', () => {
  let component: MappingComponent;
  let fixture: ComponentFixture<MappingComponent>;
  let utilService: UtilsService;
  const dialogMock = {
    close: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MappingComponent],
      imports: [
        MatSnackBarModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule],
      providers: [
        UtilsService,
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call remove row', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'removeRow').and.callThrough();
    const element = fixture.debugElement.query(By.css('.remove-row button')).nativeElement;
    component.removeRow(0);
    expect(spy).toHaveBeenCalled();
  });

  it('call expand source', () => {
    component.mappings = [{
      source: [{
        type: 'string',
        order: '1',
        isAuditable: false,
        isCacheable: false,
        isPersistable: false,
        isPrimaryKey: false,
        'ui-label': {
          en_US: 'first_name'
          ,
          name: 'first_name',
          parent: '| us - 500 | first_name',
          children: [],
          fullName: 'first_name',
          isArray: false
        },
        id: 'fild-5f2181781649b054b8c7b1de'
      }],
      target: [{
        type: 'string',
        order: '1',
        isAuditable: false,
        isCacheable: false,
        isPersistable: false,
        isPrimaryKey: false,
        id: 'fild-5f2181781649b054b8c7b1ed',
        'ui-label': {
          en_US: 'first_name'
          ,
          name: 'first_name',
          parent: '| us - 500 | first_name',
          children: [],
          fullName: 'first_name',
          isArray: false
        }
      }]
    }, {
      source: [{
        type: 'string',
        order: '1',
        isAuditable: false,
        isCacheable: false,
        isPersistable: false,
        isPrimaryKey: false,
        'ui-label': {
          en_US: 'first_name'
          ,
          name: 'first_name',
          parent: '| us - 500 | first_name',
          children: [],
          fullName: 'first_name',
          isArray: false
        },
        id: 'fild-5f2181781649b054b8c7b1de'
      }],
      target: [{
        type: 'string',
        order: '1',
        isAuditable: false,
        isCacheable: false,
        isPersistable: false,
        isPrimaryKey: false,
        id: 'fild-5f2181781649b054b8c7b1ed',
        'ui-label': {
          en_US: 'first_name'
          ,
          name: 'first_name',
          parent: '| us - 500 | first_name',
          children: [],
          fullName: 'first_name',
          isArray: false
        }
      }]
    }];
    const spy = spyOn(component, 'expandSource').and.callThrough();
    component.expandSource(0);
    expect(spy).toHaveBeenCalled();
    component.expandSource(1);
    fixture.detectChanges();
    expect(component.mappings[0].isSourceOpened).toBeUndefined();
    component.expandSource(1);
    expect(component.mappings[1].isSourceOpened).toBeFalsy();
  });

  it('get mapping dialog closed', () => {
    fixture.detectChanges();
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.closeDialog();
    expect(spy).toHaveBeenCalled();
  });

  it('get mapping dialog title', () => {
    fixture.detectChanges();
    component.activeTab = 'transformation';
    spyOn(component, 'getDialogTitle').and.callThrough();
    expect(component.getDialogTitle()).toEqual('Transformation');
  });

  it('get mapping dialog close or cancel button action', () => {
    fixture.detectChanges();
    const closeSpy = spyOn(component, 'closeDialog').and.callThrough();
    component.cancelOrBack();
    expect(closeSpy).toHaveBeenCalled();
    component.activeTab = 'transformation';
    const setActiveSpy = spyOn(component, 'setActiveTab').and.callThrough();
    component.cancelOrBack();
    expect(setActiveSpy).toHaveBeenCalled();
  });

  it('set Selected Source Target For Transformation', () => {
    fixture.detectChanges();
    component.mappings = [{
      source: [{
        type: 'string',
        order: '1',
        isAuditable: false,
        isCacheable: false,
        isPersistable: false,
        isPrimaryKey: false,
        'ui-label': {
          en_US: 'first_name'
          ,
          name: 'first_name',
          parent: '| us - 500 | first_name',
          children: [],
          fullName: 'first_name',
          isArray: false
        },
        id: 'fild-5f2181781649b054b8c7b1de'
      }],
      target: [{
        type: 'string',
        order: '1',
        isAuditable: false,
        isCacheable: false,
        isPersistable: false,
        isPrimaryKey: false,
        id: 'fild-5f2181781649b054b8c7b1ed',
        'ui-label': {
          en_US: 'first_name'
          ,
          name: 'first_name',
          parent: '| us - 500 | first_name',
          children: [],
          fullName: 'first_name',
          isArray: false
        }
      }]
    }];
    component.setSelectedSourceTargetForTransformation(component.mappings[0]);
    expect(component.selectedSource.length).toEqual(1);
  });

  it('show transformation', () => {
    component.mappings = [{
      source: [{
        type: 'string',
        order: '1',
        isAuditable: false,
        isCacheable: false,
        isPersistable: false,
        isPrimaryKey: false,
        'ui-label': {
          en_US: 'first_name'
          ,
          name: 'first_name',
          parent: '| us - 500 | first_name',
          children: [],
          fullName: 'first_name',
          isArray: false
        },
        id: 'fild-5f2181781649b054b8c7b1de'
      }],
      target: [{
        type: 'string',
        order: '1',
        isAuditable: false,
        isCacheable: false,
        isPersistable: false,
        isPrimaryKey: false,
        id: 'fild-5f2181781649b054b8c7b1ed',
        'ui-label': {
          en_US: 'first_name'
          ,
          name: 'first_name',
          parent: '| us - 500 | first_name',
          children: [],
          fullName: 'first_name',
          isArray: false
        }
      }]
    }];
    const setSourceTargetSpy = spyOn(component, 'setSelectedSourceTargetForTransformation').and.callThrough();
    const setActiveSpy = spyOn(component, 'setActiveTab').and.callThrough();
    component.showTransformation(component.mappings[0], 'transformation');
    fixture.detectChanges();
    expect(setSourceTargetSpy).toHaveBeenCalled();
    expect(setActiveSpy).toHaveBeenCalled();
  });


  it('remove selected chips', () => {
    const node = {
      type: 'string',
      order: '1',
      isAuditable: false,
      isCacheable: false,
      isPersistable: false,
      isPrimaryKey: false,
      'ui-label': {
        en_US: 'first_name'
        ,
        name: 'first_name',
        parent: '| us - 500 | first_name',
        children: [],
        fullName: 'first_name',
        isArray: false
      },
      id: 'fild-5f2181781649b054b8c7b1de'
    };
    component.mappings = [{
      source: [{
        type: 'string',
        order: '1',
        isAuditable: false,
        isCacheable: false,
        isPersistable: false,
        isPrimaryKey: false,
        'ui-label': {
          en_US: 'first_name'
          ,
          name: 'first_name',
          parent: '| us - 500 | first_name',
          children: [],
          fullName: 'first_name',
          isArray: false
        },
        id: 'fild-5f2181781649b054b8c7b1de'
      }],
      target: []
    }];
    component.remove(node, 'source', 0);
    fixture.detectChanges();
    expect(component.mappings[0].source.length).toEqual(0);
  });

  xit('expand tree', () => {
    expect(fixture.componentInstance.sourceTree).toBeDefined();
    expect(fixture.componentInstance.targetTree).toBeDefined();
    // fixture.detectChanges();
    component.expandAll(fixture.componentInstance.sourceTree, 'isSourceExpanded');
    // expect(component.isSourceExpanded).toBeTruthy();
  });

  it('set selected array', () => {
    const node = {
      type: 'string',
      order: '1',
      isAuditable: false,
      isCacheable: false,
      isPersistable: false,
      isPrimaryKey: false,
      'ui-label': {
        en_US: 'first_name'
        ,
        name: 'first_name',
        parent: '| us - 500 | first_name',
        children: [],
        fullName: 'first_name',
        isArray: false
      },
      id: 'fild-5f2181781649b054b8c7b1de'
    };
    fixture.detectChanges();
    component.setSelectedArray(0, 'source', node);
    expect(component.mappings[0].source.length).toBeTruthy();
    component.setSelectedArray(0, 'target', node);
    expect(component.mappings[0].target.length).toBeTruthy();
  });

  xit('allow drop', () => {
    const node = {
      data: {
        type: 'string',
        order: '1',
        isAuditable: false,
        isCacheable: false,
        isPersistable: false,
        isPrimaryKey: false,
        'ui-label': {
          en_US: 'first_name'
          ,
          name: 'first_name',
          parent: '| us - 500 | first_name',
          children: [],
          fullName: 'first_name',
          isArray: false
        },
        id: 'fild-5f2181781649b054b8c7b1de'
      }
    };
    fixture.detectChanges();
    const spy = spyOn(component, 'setSelectedArray').and.callThrough();
  });
});
