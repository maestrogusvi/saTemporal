import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { ConnectionService } from './connection.service';
import { MaterialModule } from '../shared/modules/material.module';

describe('ConnectionService', () => {
  let service: ConnectionService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MaterialModule
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should test s3 testConnection function', () => {
    const s3ConnectinData = {
      id: 1,
      name: 'WorkDay Connection',
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
    const dummyResponse = {
      data: 'Connection tested successfully.'
    };

    service.testConnection(s3ConnectinData).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });
    const req = httpTestingController.expectOne('/test-connection/s3');
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });

  it('should test ftp testConnection function', () => {
    const ftpConnectinData = {
      id: 2,
      name: 'ftp test connection',
      applicationName: 'NetD',
      type: 'FTP',
      description: 'some description about connection',
      connectionProperties: {
        hostName: '13.57.186.156',
        port: 21,
        username: 'sapper_user',
        password: 'sapper_demo'
      }
    };
    const dummyResponse = {
      data: 'Connection tested successfully.'
    };

    service.testConnection(ftpConnectinData).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });
    const req = httpTestingController.expectOne('/test-connection/ftp');
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });

  it('should test REST BEARER testConnection function', () => {
    const ConnectinData = {
      id: 3,
      name: 'Bearer rest',
      applicationName: 'SalesForce',
      type: 'REST_TOKEN',
      description: 'some description about connection',
      connectionProperties: {
        userName: '',
        passWard: '',
        authorizationUrl: 'https://digitalcuesqa-api.sabacloud.com/v1/login',
        httpMethod: 'GET',
        contentType: 'JSON',
        httpHeaders: {
          user: 'param.lalia@digitalcues.com',
          password: 'Welcome123'
        }
      }
    };
    const dummyResponse = {
      data: 'Connection tested successfully.'
    };

    service.testConnection(ConnectinData).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });
    const req = httpTestingController.expectOne('/test-connection/rest/token');
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });

  it('should test REST API KEY testConnection function', () => {
    const ConnectinData = {
      id: 4,
      name: 'API rest',
      applicationName: 'NetD',
      type: 'REST_API_KEY',
      description: 'some description about connection',
      connectionProperties: {
        userName: '',
        passWard: '',
        authorizationUrl: 'https://bonus.ly/api/v1/bonuses?access_token=7a836e015bd07312d4cd3a6e93e1fc59',
        connectionHttpMethod: 'GET',
        connectionQueryParameters: {
          access_token: '7a836e015bd07312d4cd3a6e93e1fc59'
        }
      }
    };
    const dummyResponse = {
      data: 'Connection tested successfully.'
    };

    service.testConnection(ConnectinData).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });
    const req = httpTestingController.expectOne('/test-connection/rest/api-key');
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });

  it('should test REST BASIC testConnection function', () => {
    const ConnectinData = {
      id: 5,
      name: 'Basic rest',
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
    const dummyResponse = {
      data: 'Connection tested successfully.'
    };

    service.testConnection(ConnectinData).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });
    const req = httpTestingController.expectOne('/test-connection/rest/basic');
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });

  it('should test OAuth(authorization-code) testConnection function', () => {
    const ConnectinData = {
      name: 'Oauth2 conn',
      applicationName: 'Sapper',
      description: 'some description about connection',
      type: 'REST_OAUTH2',
      connectionProperties: {
        grantType: 'AUTHORIZATION_CODE',
        redirectUrl: 'https://staging.sapper.ai/',
        authUrl: 'http://digitalcues.netdimensions.com/ekp/api/users?format=json&organizationId=EKP000000413',
        accessTokenUrl: 'https://slack.com/api/oauth.access',
        clientId: '6103874773.854112644322',
        clientSecret: '81560ae463fd7eb337a5ecef8fafdc41',
        scope: 'chat:write:user',
        state: '',
        responseTypeEnum: 'CODE'
      }
    };
    const dummyResponse = {
      data: 'Connection tested successfully.'
    };

    service.testConnection(ConnectinData).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });
    const req = httpTestingController.expectOne('/test-connection/rest/oauth/authorization-code');
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });

  it('should test OAuth(Password) testConnection function', () => {
    const ConnectinData = {
      name: 'Oauth2 conn',
      applicationName: 'Sapper',
      description: 'some description about connection',
      type: 'REST_OAUTH2',
      connectionProperties: {
        grantType: 'PASSWORD',
        clientId: '3MVG9GYWKbMgBvbx4WK9JJ4Pk1ts_4sf2nBncsGyBggVNNGgvN6MM0XYoTRQkCQ54Ynuh1juVVQ1VR9quUemN',
        clientSecret: 'A9A2A93342A5945DE766A4E9EB7B965C691BF013C336E619362ABE9E3C0CEAA6',
        userName: 'amarendra.singh@digitalcues.com',
        passWord: 'DigitalCues@321',
        accessTokenUrl: 'https://na136.salesforce.com/services/oauth2/token',
        contentType: 'application/x-www-form-urlencoded'
      }
    };
    const dummyResponse = {
      data: 'Connection tested successfully.'
    };

    service.testConnection(ConnectinData).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });
    const req = httpTestingController.expectOne('/test-connection/rest/oauth/password-credentials');
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });

  it('should test OAuth(Password) testConnection function', () => {
    const ConnectinData = {
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
    const dummyResponse = {
      data: 'Connection tested successfully.'
    };

    service.testConnection(ConnectinData).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });
    const req = httpTestingController.expectOne('/test-connection/rest/oauth/client-credentials');
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });

  it('should delete connection', () => {
    const id = '12345';
    const dummyResponse = {
      status: true
    };

    service.deleteConnection(id).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });
    const req = httpTestingController.expectOne(`/connection/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });

  it('should save S3 connection', () => {
    const connectionData = {
      type: 'S3',
      name: 's3 connection',
      description: 's3 connection description',
      applicationName: 'ADP',
      applicationId: '12345',
      connectionProperties: {}
    };
    service.saveConnection(connectionData);
  });

  it('should save FTP connection', () => {
    const connectionData = {
      type: 'FTP',
      name: 's3 connection',
      description: 's3 connection description',
      applicationName: 'ADP',
      applicationId: '12345',
      connectionProperties: {}
    };
    service.saveConnection(connectionData);
  });

  it('should save REST_TOKEN connection', () => {
    const connectionData = {
      type: 'REST_TOKEN',
      name: 's3 connection',
      description: 's3 connection description',
      applicationName: 'ADP',
      applicationId: '12345',
      connectionProperties: {}
    };
    service.saveConnection(connectionData);
  });

  it('should save REST_BASIC connection', () => {
    const connectionData = {
      type: 'REST_BASIC',
      name: 's3 connection',
      description: 's3 connection description',
      applicationName: 'ADP',
      applicationId: '12345',
      connectionProperties: {}
    };
    service.saveConnection(connectionData);
  });

  it('should save REST_API_KEY connection', () => {
    const connectionData = {
      type: 'REST_API_KEY',
      name: 's3 connection',
      description: 's3 connection description',
      applicationName: 'ADP',
      applicationId: '12345',
      connectionProperties: {}
    };
    service.saveConnection(connectionData);
  });

  it('should save default connection', () => {
    const connectionData = {
      type: '',
      name: 's3 connection',
      description: 's3 connection description',
      applicationName: 'ADP',
      applicationId: '12345',
      connectionProperties: {}
    };
    service.saveConnection(connectionData);
  });
});
