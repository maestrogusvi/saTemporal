import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

import { TranslateModule } from '@ngx-translate/core';
import { jsPlumb } from 'jsplumb';
import { ToastrModule } from 'ngx-toastr';

import { WorkflowConstant } from './../workflow-constant.providers';
import { MaterialModule } from '../../shared/modules/material.module';
import { PropertiesPanelComponent } from './properties-panel.component';
import { WorkflowService } from '../workflow.service';
import { UtilsService } from '../../shared/utils.service';
import { ScheduleService } from '../../schedule/schedule.service';
import { PropertiesPanelService } from './properties-panel.service';

describe('WorkflowWindowComponent', () => {
  let component: PropertiesPanelComponent;
  let fixture: ComponentFixture<PropertiesPanelComponent>;
  let httpTestingController: HttpTestingController;
  let workflowService: WorkflowService;
  let utilService: UtilsService;
  let scheduleService: ScheduleService;
  let propertiesPanelService: PropertiesPanelService;
  let dialog: MatDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PropertiesPanelComponent],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MaterialModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        RouterTestingModule
      ],
      providers: [ WorkflowConstant,
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesPanelComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    workflowService = TestBed.inject(WorkflowService);
    utilService = TestBed.inject(UtilsService);
    scheduleService = TestBed.inject(ScheduleService);
    propertiesPanelService = TestBed.inject(PropertiesPanelService);
    dialog = TestBed.inject(MatDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

    tabname = 'properties';
    component.openCloseTab(tabname);
    expect(component.displayTab).toEqual('properties');
  });

  // xit('should add field on add button and remove on delete button', () => {
  //   const mapProperties = {
  //     id: 1,
  //     name: 'Manual',
  //     imageUrl: '../../../assets/images/trigger/manual.jpg',
  //     isStart: true,
  //     properties : {
  //       group: [
  //         {
  //           grouplabel: 'Group 1',
  //           children: [
  //             {
  //               label: 'Name',
  //               cmaundaKey: 'name',
  //               type: 'text',
  //               isRequired: true,
  //               defaultvalue: 'app_name',
  //               value: 'test name'
  //             },
  //             {
  //               label: 'Properties',
  //               type: 'map',
  //               mappingProperties: [{
  //                 key: '',
  //                 value: ''
  //               }]
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   };
  //   component.rightPanelData = mapProperties;
  //   expect(component.rightPanelData.properties.group[0].children[1].label).toEqual('Properties');
  //   expect(component.rightPanelData.properties.group[0].children[1].type).toEqual('map');
  //   expect(component.rightPanelData.properties.group[0].children[1].mappingProperties.length).toEqual(1);
  //   component.addField(component.rightPanelData.properties.group[0].children[1].mappingProperties);
  //   expect(component.rightPanelData.properties.group[0].children[1].mappingProperties.length).toEqual(2);

  //   component.removeField(component.rightPanelData.properties.group[0].children[1].mappingProperties, 1);
  //   expect(component.rightPanelData.properties.group[0].children[1].mappingProperties.length).toEqual(1);

  // });

  it('should call getnodeDetails', () => {

  });

  it('should save meta', () => {
    fixture.detectChanges();
    const mockMetaData = {
      createdBy: 'rohini123',
      createdDate: '2020-07-09T11:00:37.0514792+05:30',
      lastModifiedBy: 'rohini123',
      lastModifiedDate: '2020-07-09T11:00:37.0514792+05:30',
      id: '5f06ab7d5835161160e8475b',
      meta: '{"updated_on":{"type":"string","order":8},"country":{"type":"string","order":17},"ss_no":{"type":"string","order":37}}',
      requiredProperties: {
          delimiter: ','
      },
      fileType: 'JSON',
      fileName: 'example.json'
    };

    const mockMeta = {
      updated_on: {
        name: 'updated_on',
        'ui-label': 'updated_on',
        type: 'string',
        order: 8
      },
      country: {
        name: 'country',
        'ui-label': 'country',
        type: 'string',
        order: 17
      }
    };

    const dummyResponse = {
      data: {
        ...mockMetaData,
      }
    };
    component.metaData = mockMetaData;
    component.saveMeta(mockMeta);
    const req = httpTestingController.expectOne(
      `meta/${mockMetaData.id}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush(dummyResponse); // to set response
    fixture.detectChanges();
    utilService.showSuccess('Meta saved successfully!', '');
  });

  it('should upload json file', () => {
    fixture.detectChanges();
    const f = new File([''], 'sample.json', { type: 'application/json' });

    component.fileToUpload = f;
    component.filetype = 'JSON';

    const dummyResponse = {
      data: {
          createdBy: 'rohini123',
          createdDate: '2020-07-09T11:00:37.0514792+05:30',
          lastModifiedBy: 'rohini123',
          lastModifiedDate: '2020-07-09T11:00:37.0514792+05:30',
          id: '5f06ab7d5835161160e8475b',
          meta: '{"updated_on":{"type":"string","order":8},"country":{"type":"string","order":17},' +
          '"ss_no":{"type":"string","order":37},"suffix":{"type":"null","order":24},' +
          '"jobtype_id":{"displayName":{"type":"string","order":2},"id":{"type":"string","order":1},' +
          '"order":44},"location_id":{"displayName":{"type":"string","order":2},"id":{"type":"string","order":1},"order":26},' +
          '"securityRoles":{"type":"null","order":6},"locale_id":{"displayName":{"type":"string","order":2},' +
          '"id":{"type":"string","order":1},"order":57},"password":{"type":"string","order":23},' +
          '"workphone":{"type":"string","order":47},"state":{"type":"string","order":22},"id":{"type":"string","order":28},' +
          '"desired_job_type_id":{"type":"null","order":50},"fax":{"type":"string","order":18},"job_title":{"type":"null","order":35},' +
          '"securityDomain":{"displayName":{"type":"string","order":2},"id":{"type":"string","order":1},"order":1},' +
          '"zip":{"type":"string","order":10},"fname":{"type":"string","order":45},"password_changed":{"type":"boolean","order":43},' +
          '"positions":{"type":"null","order":5},"terminated_on":{"type":"null","order":39},"requiredJobRoles":{"type":"null","order":3},' +
          '"is_manager":{"type":"boolean","order":42},"special_user":{"type":"boolean","order":31},' +
          '"person_no":{"type":"string","order":49},"created_on":{"type":"string","order":9},"is_508_user":{"type":"boolean","order":32},' +
          '"timezone_id":{"displayName":{"type":"string","order":2},"id":{"type":"string","order":1},"order":56},' +
          '"home_domain":{"displayName":{"type":"string","order":2},"id":{"type":"string","order":1},"order":41},' +
          '"status":{"type":"string","order":25},"ethnicity":{"type":"null","order":12},"gender":{"type":"number","order":20},' +
          '"homephone":{"type":"string","order":48},"city":{"type":"string","order":16},"date_of_birth":{"type":"null","order":34},' +
          '"person_type":{"type":"string","order":38},"mname":{"type":"string","order":33},"title":{"type":"string","order":19},' +
          '"job_title_type":{"type":"null","order":29},"lname":{"type":"string","order":46},"secret_question":{"type":"null","order":51},' +
          '"correspondence_preference3":{"type":"string","order":55},"started_on":{"type":"string","order":40},' +
          '"correspondence_preference2":{"type":"string","order":54},"manager_id":{"displayName":{"type":"string","order":2},' +
          '"id":{"type":"string","order":1},"order":58},"optionalJobRoles":{"type":"null","order":4},' +
          '"correspondence_preference1":{"type":"string","order":53},"email":{"type":"string","order":21},' +
          '"customValues":{"custom1":{"type":"null","order":1},"custom2":{"type":"null","order":2},"order":2},' +
          '"addr2":{"type":"string","order":14},"company_id":{"displayName":{"type":"string","order":2},"id":{"type":"string","order":1},' +
          '"order":36},"addr1":{"type":"string","order":13},"addr3":{"type":"string","order":15},"religion":{"type":"null","order":11},' +
          '"secret_answer":{"type":"null","order":52},"home_company_id":{"displayName":{"type":"string","order":2},' +
          '"id":{"type":"string","order":1},"order":30},"audiencetypes":{"type":"null","order":7},"username":{"type":"string","order":27}}',
          requiredProperties: {
              delimiter: ','
          },
          fileType: 'JSON',
          fileName: 'example.json'
      }
    };

    component.uploadFile();
    const req = httpTestingController.expectOne(
      'meta?fileType=' + 'JSON'
    );
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse); // to set response
    fixture.detectChanges();
  });

  it('should select json file', () => {
    // let f = new File([""], "sample.json", { type: 'application/json' });
    // const files: FileList = new FileList();
  });
});
