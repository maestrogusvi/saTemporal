import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastrService, ToastrModule } from 'ngx-toastr';

import { UtilsService } from './utils.service';
import { IUserData } from '../authentication/login/login.interface';
import { MaterialModule } from './modules/material.module';

describe('UtilsService', () => {
  let service: UtilsService;
  const dataLabel = 'test';
  const testData = 'admin';
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let translate: TranslateService;
  let toastrService: ToastrService;
  let snackBar: MatSnackBar;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MaterialModule
      ],
      providers: [
        TranslateService
      ]
    })
  );

  beforeEach(() => {
    service = TestBed.inject(UtilsService);
    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    const data = { test: 'admin' };
    const mockSessionStorage = {
      getItem: (key: string): string => {
        return data[key];
      },
      setItem: (key: string, value: string) => {
        data[key] = `${value}`;
      },
      clear: () => {
        delete data.test;
      }
    };
    spyOn(sessionStorage, 'getItem').and.callFake(mockSessionStorage.getItem);
    spyOn(sessionStorage, 'setItem').and.callFake(mockSessionStorage.setItem);
    spyOn(sessionStorage, 'clear').and.callFake(mockSessionStorage.clear);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get default language', () => {
    const defaultLanguage = 'en';
    expect(service.getDefaultLang()).toEqual(defaultLanguage);
  });

  it('should load translations', async(() => {
    translate = TestBed.inject(TranslateService);
    spyOn(translate, 'getBrowserLang').and.returnValue('');
    const service1 = new UtilsService(translate, httpClient, toastrService, snackBar);
 }));

  it('should check string  is empty or not', () => {
    const data = 'test string';
    expect(service.checkIfDataExsists(data)).toBeTruthy();
  });

  it('should check boolean data is empty or not', () => {
    const data = true;
    expect(service.checkIfDataExsists(data)).toBeTruthy();
  });

  it('should check object data is empty or not', () => {
    const data = [1, 2];
    expect(service.checkIfDataExsists(data)).toBeTruthy();
  });

  it('negative test case for data check', () => {
    const data = undefined;
    expect(service.checkIfDataExsists(data)).toBeFalsy();
  });

  it('should set data in session storage', () => {
    service.setItemInSessionStorage(dataLabel, testData);
    expect(sessionStorage.getItem(dataLabel)).toBe(testData);
  });

  it('should get data from session storage', () => {
    service.getItemFromSessionStorage(dataLabel);
    expect(sessionStorage.getItem(dataLabel)).toEqual(testData);
  });

  it('should clear data from session storage', () => {
    service.clearSessionStorage();
    expect(sessionStorage.getItem(dataLabel)).toBe(undefined);
  });

  it('can test HttpClient.get', () => {
    const testDataName = {name: 'Test Data'};
    const testUrl = '/data';
    // Make an HTTP GET request
    service.returnGetCall(testUrl)
      .subscribe(data =>
        // When observable resolves, result should match test data
        expect(data).toEqual(testDataName)
      );
    // The following `expectOne()` will match the request's URL.
    // If no requests or multiple requests matched that URL
    // `expectOne()` would throw.
    const req = httpTestingController.expectOne('/data');
    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');
    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    req.flush(testDataName);
    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();
  });

  it('can test HttpClient.post', () => {
    const testUrl = 'rest/api/user';
    const request: IUserData = {
      username: 'admin@gmail.com',
      password: '12345'
    };
    const dummyResponse = {
      id: '12345',
      email: 'admin@gmail.com',
      password: '12345',
      firstName: 'Admin'
    };
    service.returnPostCall(testUrl, request).subscribe((response) => {
    expect(response).toEqual(dummyResponse);
    });
    const req = httpTestingController.expectOne(
    'rest/api/user'
    );
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });

  it('can test HttpClient.put', () => {
    const api = 'rest/api/user/{:id}';
    const request = {
      firstName: 'Super Admin'
    };
    const dummyResponse = {
      id: '12345',
      email: 'admin@gmail.com',
      password: '12345',
      firstName: 'Super Admin'
    };
    service.returnPutCall(api, request).subscribe((response) => {
    expect(response).toEqual(dummyResponse);
    });
    const req = httpTestingController.expectOne(
    'rest/api/user/{:id}'
    );
    expect(req.request.method).toBe('PUT');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });

  it('can test HttpClient.delete ', () => {
    const api = 'rest/api/user/{:id}';
    const dummyResponse =  {
      user: false
    };
    service.returnDeleteCall(api).subscribe((response) => {
    expect(response).toEqual(dummyResponse);
    });
    const req = httpTestingController.expectOne(
    'rest/api/user/{:id}'
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });

  it('to fetch the response data', () => {
    const responseData = {
      data: {
        username: 'admin@gmail.com',
        password: '12345'
      }
    };
    const dummyResponse = {
        username: 'admin@gmail.com',
        password: '12345'
    };
    service.fetchResponseData(responseData);
    expect(service.fetchResponseData(responseData)).toEqual(dummyResponse);
  });

  it('to fetch the response message', () => {
    const responseData = {
      message: {
        message: 'unauthorized'
      }
    };
    const dummyResponse = {
      message: 'unauthorized',
    };
    service.fetchResponseData(responseData);
    expect(service.fetchResponseData(responseData)).toEqual(dummyResponse);
  });

  it('to fetch the response status', () => {
    const responseData = {
      status: true
    };
    const dummyResponse = true;
    service.fetchResponseData(responseData);
    expect(service.fetchResponseData(responseData)).toEqual(dummyResponse);
  });

  it('to fetch the response count', () => {
    const responseData = {
      count: '100'
    };
    const dummyResponse = '100';
    service.fetchResponseData(responseData);
    expect(service.fetchResponseData(responseData)).toEqual(dummyResponse);
  });

  it('negative test case for fetch the response', () => {
    const responseData = {};
    const dummyResponse = false;
    service.fetchResponseData(responseData);
    expect(service.fetchResponseData(responseData)).toEqual(dummyResponse);
    expect(service.fetchResponseData(null)).toEqual(dummyResponse);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });
});
