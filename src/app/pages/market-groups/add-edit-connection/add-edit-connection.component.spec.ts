import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { HttpLoaderFactory } from '../../../app.module';
import { ConnectionsComponent } from './../connections.component';
import { AddEditConnectionComponent } from './add-edit-connection.component';
import { MaterialModule } from '../../shared/modules/material.module';
import { UtilsService } from '../../shared/utils.service';
import { ConnectionService } from '../connection.service';
import { AppStoreService } from '../../app-store/app-store.service';
import { of } from 'rxjs';
import { Component, Input } from '@angular/core';

describe('AddEditConnectionComponent', () => {
  @Component({
    selector: 'sapper-s3',
    template: ''
  })
  class S3ComponentStub {
    @Input() connectionData;
  }

  const modalData = {
    id: '12345',
    name: 's3 connection',
    type: 'S3',
    description: '',
    applicationId: '12345',
    applicationName: 'ADP',
    connectionProperties: {}
  };

  let component: AddEditConnectionComponent;
  let fixture: ComponentFixture<AddEditConnectionComponent>;
  let httpTestingController: HttpTestingController;
  let connectionService: ConnectionService ;
  let utilsService: UtilsService;
  let appStoreService: AppStoreService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditConnectionComponent , S3ComponentStub],
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
        ToastrModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        MatIconModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: modalData },
        TranslateService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditConnectionComponent);
    connectionService = TestBed.inject(ConnectionService);
    utilsService = TestBed.inject(UtilsService);
    appStoreService = TestBed.inject(AppStoreService);
    component = fixture.componentInstance;
    component.connectionData = {
      id: '1',
      name: 'WorkDay Connection',
      applicationId: '12345',
      applicationName: 'WorkDay',
      type: 'S3',
      description: 'some description about connection',
      connectionProperties: {
        bucketName: 'sapper3-test',
        accessKey: 'AKIAIMU6BZQNHEWST2VA1',
        secretAccessKey: 'bFP1x6n4wxy4lUUB6iZHy+IgAtJVF1U6CMau1874',
        region: 'ap-south-1'
      }
    };
    fixture.detectChanges();
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check type of connection and return boolean value', () => {
    const connectionData = {
      name: 'Basic rest',
      applicationId: '12345',
      applicationName: 'Sapper',
      type: 'REST_BASIC',
      description: 'some description about connection',
      connectionProperties: {
        userName: 'arun',
        passWard: 'password',
        authorizationUrl: 'http://digitalcues.netdimensions.com/ekp/api/users?format=json&organizationId=EKP000000413',
        httpMethod: 'GET'
      }
    };
    component.connectionData = connectionData;
    component.connectionData.type = 'REST_TOKEN';
    let result = component.chechType();
    expect(result).toBeTruthy();

    component.connectionData.type = 'REST_BASIC';
    result = component.chechType();
    expect(result).toBeTruthy();

    component.connectionData.type = 'REST_API_KEY';
    result = component.chechType();
    expect(result).toBeTruthy();

    component.connectionData.type = 'REST';
    result = component.chechType();
    expect(result).toBeFalsy();

  });

  it('should test OAuth(Password) testConnection function', () => {
    const connectinData = {
      name: 'Oauth2 conn',
      applicationName: 'Sapper',
      description: 'some description about connection',
      type: 'REST_OAUTH2',
      connectionProperties: {
        grantType: 'CLIENT_CREDENTIALS',
        clientId: '3MVG9GYWKbMgBvbx4WK9JJ4Pk1ts_4sf2nBncsGyBggVNNGgvN6MM0XYoTRQkCQ54Ynuh1juVVQ1VR9quUemN',
        clientSecret: 'A9A2A93342A5945DE766A4E9EB7B965C691BF013C336E619362ABE9E3C0CEAA6',
        accessTokenUrl: 'https://na136.salesforce.com/services/oauth2/token',
        contentType: 'application/x-www-form-urlencoded'
      }
    };
    spyOn(connectionService, 'testConnection').and.returnValue(of(connectinData));
    const spyOnUtilsService = spyOn(utilsService, 'showSuccess').and.callThrough();
    component.testConnection();
    expect(spyOnUtilsService).toHaveBeenCalled();
  });

  xit('should open & close modal', () => {
    let component1: ConnectionsComponent;
    let fixture1: ComponentFixture<ConnectionsComponent>;

    fixture1 = TestBed.createComponent(ConnectionsComponent);
    component1 = fixture1.componentInstance;

    spyOn(component1, 'openPopUp').and.callThrough();
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
    component1.openPopUp(connectionData);
    fixture.detectChanges();
    expect(document.querySelector('h4.dialog-title').textContent).toEqual('ADD-EDIT-CONNECTION-POPUP.TITLE-EDIT');
  });

  it('should save connection', () => {
    const data = 'some data';
    component.connectionData.applicationId = '12345';
    component.connectionData.applicationName = 'ADP';
    spyOn(connectionService, 'saveConnection').and.returnValue(of(data));
    const spyOnUtilsService = spyOn(utilsService, 'showSuccess').and.callThrough();
    component.saveConnection();
    expect(spyOnUtilsService).toHaveBeenCalled();
  });

  it('should get all the applications', () => {
    const applicationList = {data: [{
      id: '1',
      name: 'ADP'
    }]};
    spyOn(appStoreService, 'getAllApplicationsLov').and.returnValue(of(applicationList));
    component.getApplicationList();
    expect(component.applicationList).toEqual(applicationList.data);
  });
});
