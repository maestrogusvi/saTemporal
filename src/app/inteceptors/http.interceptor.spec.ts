import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';

import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { HttpInterceptorService } from './http.interceptor';
import { MaterialModule } from '../pages/shared/modules/material.module';


const posts: Array<any> = [
  {
    userId: 1,
    id: 1,
    title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et '
  },
  {
    userId: 1,
    id: 2,
    title: 'qui est esse',
    body: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor b'
  }
];

describe('HttpInterceptorService', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  const testUrl = '/data';
  let interceptorService: HttpInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
        MaterialModule
      ],
      providers: [
        HttpClient,
        { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    interceptorService = TestBed.inject(HttpInterceptorService);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    const service: HttpInterceptorService = TestBed.inject(HttpInterceptorService);
    expect(service).toBeTruthy();
  });

  it('must log the http get request', (done) => {
    const service: HttpInterceptorService = TestBed.inject(HttpInterceptorService);
    httpClient.get('http://jsonplaceholder.typicode.com/posts')
      .subscribe(
        (data: any) => {
          expect(data.length).toBe(2);
          done();
        }
      );
    httpClient.get('http://jsonplaceholder.typicode.com/todo/1')
      .subscribe(
        (data: any) => {
          expect(data.length).toBe(2);
          done();
        }
      );
    const req: TestRequest = httpMock.expectOne('http://jsonplaceholder.typicode.com/posts');
    const req1: TestRequest = httpMock.expectOne('http://jsonplaceholder.typicode.com/todo/1');
    expect(req.request.method).toEqual('GET');
    req.flush(posts);
    req1.flush(posts);
    httpMock.verify();
  });

  it('should set headers', inject([HttpClient], (http: HttpClient) => {

    sessionStorage.setItem('auth_token', 'any auth token here');
    http.get('http://jsonplaceholder.typicode.com/todo/1').subscribe();
    const httpRequest1: TestRequest = httpMock.expectOne('http://jsonplaceholder.typicode.com/todo/1');
    expect(httpRequest1.request.headers.has('Authorization')).toBeTruthy();
    httpRequest1.flush(posts);

    sessionStorage.clear();
    http.get('/dummy').subscribe();
    const httpRequest: TestRequest = httpMock.expectOne('/dummy');
    expect(httpRequest.request.headers.has('Authorization')).toBeFalsy();

    httpRequest.flush(posts);
  }));


  it('When 401 or 403, user is automatically logged out and error is rethrow', () => {

    const errorMessage = {
      Error_Code: '401',
      Error_Message: 'Http failure response for /data: 401 Unauthorized'
    };

    // Make an HTTP GET request
    httpClient.get(testUrl).subscribe(
      res => fail('should have failed with the 401 error'),
      (error: HttpErrorResponse) => {
        expect(error).toMatch(errorMessage.Error_Message);
      }
    );

    // The following `expectOne()` will match the request's URL.
    const req = httpMock.expectOne(testUrl);

    // Respond with mock error
    req.flush(errorMessage, { status: 401, statusText: 'Unauthorized' });
  });

  it('test', () => {

    const errorMessage = {
      Error_Code: '401',
      Error_Message: 'Http failure response for /data: 401 Unauthorized'
    };

    // Make an HTTP GET request
    httpClient.get(testUrl).subscribe(
      res => fail('Client-side errors'),
      (error: ErrorEvent) => {
        expect(error).toMatch(errorMessage.Error_Message);
      }
    );

    // The following `expectOne()` will match the request's URL.
    const req = httpMock.expectOne(testUrl);

    // Respond with mock error
    req.flush(errorMessage, { status: 401, statusText: 'Unauthorized' });
  });
});
