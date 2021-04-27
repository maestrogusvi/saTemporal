import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { HttpLoaderFactory } from '../../app.module';
import { MaterialModule } from '../shared/modules/material.module';
import { RoleMappingComponent } from './market-group.component';

describe('ConnectionsComponent', () => {
  let component: RoleMappingComponent;
  let fixture: ComponentFixture<RoleMappingComponent>;
  let http: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleMappingComponent ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        HttpClientTestingModule,
        MaterialModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleMappingComponent);
    component = fixture.componentInstance;
    component.connectionList = [
      {
        type: 'S3',
        name: 's3 connection',
        description: 's3 connection description',
        applicationName: 'ADP',
        applicationId: '12345',
        connectionProperties: {}
      }
    ];
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dailog', () => {
    spyOn(component, 'openPopUp').and.callThrough();
    const editButton = fixture.debugElement.queryAll(By.css('.icons .edit-icon'));
    expect(editButton).toBeTruthy();
    const connectionData = {
      id: 1,
      name: 'WorkDay Connection',
      applicationName: 'WorkDay',
      type: 'S3',
      subType: 'S3',
      description: 'some description about connection',
      connectionProperties: {
        bucketName: 'sapper3-test',
        accessKey: 'AKIAIMU6BZQNHEWST2VA1',
        secretAccessKey: 'bFP1x6n4wxy4lUUB6iZHy+IgAtJVF1U6CMau1874',
        region: 'ap-south-1'
      }
    };
    expect(document.querySelector('h4.dialog-title')).toBeFalsy();
    component.openPopUp(connectionData);
    fixture.detectChanges();
    expect(document.querySelector('h4.dialog-title').textContent).toEqual('ADD-EDIT-CONNECTION-POPUP.TITLE-EDIT');
  });

  it('should call lazy load function', fakeAsync(() => {
    const event = {
      first: 0,
      rows: 5
    };
    component.loadLazy(event);
    tick();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.connectionsPerPage.length).toEqual(1);
    });

    component.connectionList = [];
    component.loadLazy(event);
    tick();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.connectionsPerPage.length).toEqual(1);
    });
  }));

  it('should open dailog', () => {
    const createButton = fixture.debugElement.queryAll(By.css('.create-connection .sapper-button'));
    expect(createButton).toBeTruthy();
    const connectionData = {};
    component.openCreateConnectionDialog();
    fixture.detectChanges();
    expect(document.querySelector('h4.dialog-title').textContent).toEqual('Create Connection');
    expect(component.getConnectionListing).toHaveBeenCalled();
  });

  it('should delete the connection', () => {
    const id = 'workflow1-id';
    spyOn(component, 'deleteConnection').and.callThrough();
    const connectionListingSpy = spyOn(component, 'getConnectionListing').and.callThrough();
    component.deleteConnection(id);
    expect(connectionListingSpy).toBeDefined();
    expect(connectionListingSpy).toHaveBeenCalledTimes(0);
  });

  it('should get all the connections', () => {
    component.getConnectionListing();
    expect(component.connectionList.length).toBeGreaterThan(0);
  });

});
