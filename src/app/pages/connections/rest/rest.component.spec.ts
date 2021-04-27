import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestComponent } from './rest.component';

describe('RestComponent', () => {
  let component: RestComponent;
  let fixture: ComponentFixture<RestComponent>;

  const connectioinData = {
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
  const connectioinData1 = {
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.connectionData = undefined;
    component.ngOnInit();
    expect(component.connectionData).toBeUndefined();

    component.connectionData = connectioinData;
    component.ngOnInit();
    expect(component.connectionData.type).toBe('REST_TOKEN');

    component.connectionData = connectioinData1;
    component.ngOnInit();
    expect(component.connectionData.type).toBe('REST_API_KEY');

    component.connectionData.type = undefined;
    component.ngOnInit();
    expect(component.connectionData.type).toBeUndefined();
  });

  it('should call addField function', () => {
    component.addField();
    expect(component.headerArr.length).toBe(1);

    component.addField();
    expect(component.headerArr.length).toBe(2);
  });
});
