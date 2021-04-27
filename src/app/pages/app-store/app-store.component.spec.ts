import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { ToastrModule } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AppStoreComponent } from './app-store.component';
import { SearchPipe } from '../shared/pipes/search.pipe';
import { MaterialModule } from '../shared/modules/material.module';

describe('AppStoreComponent', () => {

  let component: AppStoreComponent;
  let fixture: ComponentFixture<AppStoreComponent>;
  let router: Router;

  const appData = [
    {
      createdBy: null,
      createdDate: null,
      lastModifiedBy: null,
      lastModifiedDate: '2020-08-17T00:32:18.01721+05:30',
      id: '5efed7cfcb6a6f2fc075d6a1',
      name: 'ADP',
      description: 'ADP provides Payroll,HR & Time and Attendance solutions for businesses of all sizes, local and global.',
      logoPath: 'https://s3.ap-south-1.amazonaws.com/sapper3.0-images/application/ADP.png',
      objectUrl: '',
      versions: [],
      categories: [
        'Payroll',
        'HCM',
        'Benefits'
      ],
      type: 'APPLICATION'
    },
    {
      createdBy: null,
      createdDate: null,
      lastModifiedBy: null,
      lastModifiedDate: '2020-08-17T00:32:18.02469+05:30',
      id: '5efed7cfcb6a6f2fc075d6a3',
      name: 'Adobe EM',
      description: 'Adobe Experience Manager (AEM), is a comprehensive content management solution for building websites.',
      logoPath: 'https://s3.ap-south-1.amazonaws.com/sapper3.0-images/application/Adobe+Experie.jpg',
      objectUrl: '',
      versions: [],
      categories: [
        'Collaboration Portal'
      ],
      type: 'APPLICATION'
    },
    {
      createdBy: null,
      createdDate: null,
      lastModifiedBy: null,
      lastModifiedDate: '2020-08-17T00:32:18.025117+05:30',
      id: '5efed7cfcb6a6f2fc075d6a5',
      name: 'Jira',
      description: 'Jira is a proprietary issue tracking product developed by Atlassian that allows bug tracking.',
      logoPath: 'https://s3.ap-south-1.amazonaws.com/sapper3.0-images/application/jira.jpg',
      objectUrl: '',
      versions: [],
      categories: [
        'Ticketing Systems'
      ],
      type: 'APPLICATION'
    },
    {
      createdBy: null,
      createdDate: null,
      lastModifiedBy: null,
      lastModifiedDate: '2020-08-17T00:32:18.025369+05:30',
      id: '5efed7cfcb6a6f2fc075d6a7',
      name: 'ServiceNow',
      description: 'ServiceNow has service management offerings for IT, human resources, security, customer service, software development.',
      logoPath: 'https://s3.ap-south-1.amazonaws.com/sapper3.0-images/application/servicenow-logo.png',
      objectUrl: '',
      versions: [],
      categories: [
        'CRM'
      ],
      type: 'APPLICATION'
    },
    {
      createdBy: null,
      createdDate: null,
      lastModifiedBy: null,
      lastModifiedDate: '2020-08-17T00:32:18.025608+05:30',
      id: '5efed7cfcb6a6f2fc075d6a9',
      name: 'SumTotal',
      description: 'SumTotal Systems, Inc. provides human resource management software and services to private.',
      logoPath: 'https://s3.ap-south-1.amazonaws.com/sapper3.0-images/application/sumtotal.jpg',
      objectUrl: '',
      versions: [],
      categories: [
        'LMS'
      ],
      type: 'APPLICATION'
    },
  ];
  const domainList = [
    'HRMS', 'CRM', 'LMS', 'HCM', 'Benefits', 'Time Management', 'Payroll',
    'Content', 'Productivity', 'E-Commerce', 'Data Warehouse', 'Social Network',
    'SSO', 'Certification', 'Micro Content', 'Analytics', 'Ticketing Systems',
    'Gamification', 'Recruiting Systems', 'Media Service Provider', 'Collaboration Portal',
    'Communication'];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppStoreComponent, SearchPipe],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        MaterialModule,
        BrowserAnimationsModule,
        FormsModule
      ],
      providers: [TranslateService]
    })
    .compileComponents();
    fixture = TestBed.createComponent(AppStoreComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
   // component.appData = appData;
    component.domainList = domainList;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select application', () => {
    const app = {
      id: 1,
      name: 'Adobe',
      description: 'Some description',
      imageUrl: '../../../assets/images/Applications/adobe.png',
      category: 'HRMS'
    };
    expect(component.selectedApp.length).toEqual(0);
    component.selectApplication(app);
    expect(component.selectedApp.length).toEqual(1);
    expect(component.selectedApp[0]).toEqual('Adobe');

    component.selectApplication(app);
    expect(component.selectedApp.length).toEqual(1);
    expect(component.selectedApp[0]).toEqual('Adobe');
  });

  it('should remove application', () => {
    const app = {
      id: 1,
      name: 'Adobe',
      description: 'Some description',
      imageUrl: '../../../assets/images/Applications/adobe.png',
      category: 'HRMS'
    };
    const app1 = {
      id: 2,
      name: 'saba',
      description: 'Some description',
      imageUrl: '../../../assets/images/Applications/adobe.png',
      category: 'HRMS'
    };
    const app2 = {
      id: 2,
      name: 'saba',
      description: 'Some description',
      imageUrl: '../../../assets/images/Applications/adobe.png',
      category: 'HRMS'
    };
    component.selectApplication(app);
    component.selectApplication(app1);

    expect(component.selectedApp.length).toEqual(2);

    component.removeApp(app.name);
    expect(component.selectedApp.length).toEqual(1);

    component.removeApp(app1.name);
    expect(component.selectedApp.length).toEqual(0);

    component.removeApp(app1.name);
    expect(component.selectedApp.length).toEqual(0);
  });

  it('should clear search', () => {
    component.searchText = 'pooja';
    component.clearSearchText();
    expect(component.searchText).toEqual('');
  });

  it('should select domain', () => {
    let event = {
      checked: true
    };
    component.appDataCopy = appData;
    component.selectDomain(event, 'HRMS', 0);
    expect(component.domainList.length).toEqual(22);
    expect(component.domainSelected.length).toBe(1);

    expect(component.domainSelected[0]).toEqual('HRMS');
    // expect(component.appData.length).toEqual(2);
    // expect(component.applicationList[0].category).toEqual('HRMS');

    component.selectDomain(event, 'LMS', 0);
    expect(component.domainSelected.length).toBe(2);

    expect(component.domainSelected[1]).toEqual('LMS');
    // expect(component.appData.length).toEqual(2);
    // expect(component.applicationList[1].category).toEqual('LMS');

    event = {
      checked: false
    };
    component.selectDomain(event, 'HRMS', 0);
    expect(component.domainList.length).toEqual(22);
    expect(component.domainSelected.length).toBe(1);

    component.selectDomain(event, 'LMS', 0);
    expect(component.domainSelected.length).toBe(0);
    expect(component.applicationList.length).toEqual(5);

  });

  it('should redirect to community workflow page', () => {
    component.selectedApp = ['ADP', 'Jira'];

    const spy = spyOn(router, 'navigateByUrl');
    component.redirect();
    const url = spy.calls.first().args[0];
    expect(url).toBe('/community-workflow?apps=ADP,Jira');
  });

  it('should get domain name', () => {
    let domainName = 'some long doamin name which has more than 25 characters';
    let result = component.getDomainName(domainName);
    expect(result).toEqual('some long doamin name whi...');

    domainName = 'Time Management';
    result = component.getDomainName(domainName);
    expect(result).toEqual('Time Management');
  });

  it('should check tooltip enabled or not', () => {
    let domainName = 'some long doamin name which has more than 25 characters';
    let result = component.isTooltipEnabled(domainName);
    expect(result).toBeFalsy();

    domainName = 'Time Management';
    result = component.isTooltipEnabled(domainName);
    expect(result).toBeTruthy();
  });
});
