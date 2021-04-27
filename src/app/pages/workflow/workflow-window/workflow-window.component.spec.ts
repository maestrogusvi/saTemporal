import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { TranslateModule } from '@ngx-translate/core';
import { jsPlumb } from 'jsplumb';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';

import { WorkflowWindowComponent } from './workflow-window.component';
import { WorkflowConstant } from './../workflow-constant.providers';
import { MaterialModule } from '../../shared/modules/material.module';
import { WorkflowWindowService } from './workflow-window.service';
import { UtilsService } from '../../shared/utils.service';

describe('WorkflowWindowComponent', () => {
  let component: WorkflowWindowComponent;
  let fixture: ComponentFixture<WorkflowWindowComponent>;
  let nodeObj;
  let draggedData;
  let jsPlumbInstance;
  let errorJson;
  let workflowWindowService: WorkflowWindowService;
  let utilsService: UtilsService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkflowWindowComponent],
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
    nodeObj = {
      id: 'node_1_Manual',
      top: '100px',
      left: '100px',
      data: {
        name: 'Manual'
      }
    };
    draggedData = [
      {
        id: 'node_1_Manual',
        top: '100px',
        left: '100px',
        data: {
          name: 'Manual'
        }
      },
      {
        id: 'node_2_Salesforce',
        top: '100px',
        left: '100px',
        data: {
          name: 'Salesforce'
        }
      }
    ];
    errorJson = {
      name: 'Test Workflow',
      description: 'Test Workflow description',
      tasks: [
        {
          id: 'node_1_ServiceNow',
          status: 'FAILED',
          message: 'FAILED message'
        },
        {
          id: 'node_2_Jira',
          status: 'SUCCESS',
          message: 'SUCCESS message'
        }
      ]
    };
    fixture = TestBed.createComponent(WorkflowWindowComponent);
    component = fixture.componentInstance;
    jsPlumbInstance = jsPlumb.getInstance();
    workflowWindowService = TestBed.inject(WorkflowWindowService);
    utilsService = TestBed.inject(UtilsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit on dropping node in workflow component', () => {
    const node = {
      dragData: {
        id: 1,
        name: 'Adobe',
        description: 'Some description',
        imageUrl: '../../../assets/images/Applications/adobe.png',
        category: 'HRMS',
        properties: {
          group: [
            {
              grouplabel: 'General Information',
              children: [
                {
                  label: 'Name',
                  cmaundaKey: 'name',
                  type: 'text',
                  isRequired: true,
                  defaultvalue: 'app_name',
                  value: 'test name',
                },
                {
                  label: 'Description',
                  cmaundaKey: 'name1',
                  type: 'textarea',
                  isRequired: true,
                  defaultvalue: 'some_value',
                  value: 'some description',
                },
              ],
            },
            {
              grouplabel: 'Connection Details',
              action: [
                {
                  btnIcon: 'Add',
                  btnVal: 'Add Connection',
                  btnCallback: 'test',
                },
              ],
              children: [
                {
                  label: 'Connection Type',
                  cmaundaKey: 'opp1',
                  type: 'select',
                  isRequired: true,
                  defaultvalue: 'my_app',
                  optionVal: [
                    'FTP',
                    'REST',
                    'S3',
                    'Webhook',
                    'Database',
                    'SOAP',
                  ],
                  value: ['FTP'],
                },
                {
                  labe: 'Connection Name',
                  cmaundaKey: 'opp1',
                  type: 'select',
                  isRequired: true,
                  defaultvalue: 'my_app',
                  optionVal: ['FTP_data_complete', 'FTP_users', 'FTP_contact'],
                  value: ['FTP_users'],
                },
                {
                  label: 'Operation',
                  cmaundaKey: 'opp1',
                  type: 'select',
                  isRequired: true,
                  defaultvalue: 'my_app',
                  optionVal: [
                    'Users',
                    'Contact',
                    'Affiliation',
                    'Certifications',
                  ],
                  value: ['Affiliation'],
                },
              ],
            },
          ],
        },
      },
      mouseEvent: {
        isTrusted: true,
      },
    };
    spyOn(component.getDropData, 'emit');
    expect(component.counter).toBe(0);
    expect(component.dragedData.length).toBe(0);
    component.drop(node);
    expect(component.counter).toBe(1);
    expect(component.dragedData.length).toBe(1);
    expect(component.getDropData.emit).toHaveBeenCalledWith(node.dragData);

    // TODO: add test cases for addEndPointsToDroppedNode()
  });

  it('should delete a node', () => {
    const node = {
      id: 'node_1_Manual',
      name: 'Manual',
      description: 'Description',
      type: 'ftpSink',
      connectionId: '123',
      propertiesId: '456',
      metaId: '789',
      nextTaskIds: [],
      previousTaskIds: [],
      inbound: '',
      outbound: '',
      top: 20,
      left: 120,
      logoPath: '',
      extraProperties: {}
    };
    component.dragedData.push(nodeObj);
    expect(component.dragedData.length).toBe(1);
    component.deleteNode(node);
    expect(component.dragedData.length).toBe(0);

    const nodeObjTwo = {
      id: 'temp_id',
      top: '100px',
      left: '100px',
      data: {
        name: 'Manual'
      }
    };
    component.dragedData.push(nodeObjTwo);
    expect(component.dragedData.length).toBe(1);
    component.deleteNode(nodeObj);
    expect(component.dragedData.length).toBe(1);
  });

  it('should delete a node for else part', () => {
    const nodeObjTwo = {
      id: 'temp_id',
      top: '100px',
      left: '100px',
      data: {
        name: 'Manual'
      }
    };
    component.dragedData.push(nodeObjTwo);
    expect(component.dragedData.length).toBe(1);
    component.deleteNode(nodeObj);
    expect(component.dragedData.length).toBe(1);
  });

  it('should create a copy of a node', () => {
    expect(component.counter).toBe(0);
    expect(component.dragedData.length).toBe(0);
    component.copyNode(nodeObj);
    expect(component.counter).toBe(1);
    expect(component.dragedData.length).toBe(1);
  });

  // it('should adjust zoom', () => {
  //   component.zoomAdjust('inc');
  //   const dropZone = fixture.debugElement.queryAll(By.css('#drop-zone'));
  //   expect(dropZone[0].nativeElement.style.transform).toBe('scale(1.1)');

  //   component.zoomAdjust('desc');
  //   expect(dropZone[0].nativeElement.style.transform).toBe('scale(1)');

  //   component.zoomAdjust('desc');
  //   expect(dropZone[0].nativeElement.style.transform).toBe('scale(0.9)');
  // });

  it('should create a node with connected line on addNodeToActive() click', () => {
    const node = {
      id: 'node_1_Manual',
      top: '100px',
      left: '100px',
      data: {
        name: 'Manual'
      }
    };
    component.addNode(nodeObj);
    component.addNodeToActive(node.data);
    setTimeout(() => {
      expect(component.jsPlumbInstance.connect).toHaveBeenCalled();
    }, 100);
  });

  it('should autoarrange all the nodes in the workflow', () => {
    component.dragedData = draggedData;
    component.autoArrange();
  });

  xit('should upload json file', () => {
    const event = {
      isTrusted: true,
      type: 'change',
      target: {
        files: [
          {
            name: 'test.json'
          }
        ]
      }
    };
    component.dragedData.length = 0;
    component.uploadJsonFile(event);
    component.dragedData.length = 2;
    component.uploadJsonFile(event);
  });

  it('should save the workflow', () => {
    const workflowData = {
      id: '5ee210ad7b0edc48fc9df586',
      name: 'Saba user sync to NetD',
      description: 'Saba user sync to NetD',
      tasks: {}
    };
    spyOn(workflowWindowService, 'updateWorkflow').and.returnValue(of(workflowData));
    const spyOnUtilsService = spyOn(utilsService, 'showSuccess').and.callThrough();
    component.saveWorkflow();
    expect(spyOnUtilsService).toHaveBeenCalled();
  });

  it('should open right panel with properties on node click ', () => {
    const event = true;
    const itemData = nodeObj;
    const e = jasmine.createSpyObj('event', [ 'stopPropagation' ]);
    component.onNodeClicked(itemData, e);
    expect(component.selectedItem).toEqual(itemData.id);
    expect(e.stopPropagation).toHaveBeenCalled();
  });

  it('should clear the workflow ', () => {
    component.dragedData = draggedData;
    spyOn(component.getDropData, 'emit');
    component.clearCanvas();
    fixture.detectChanges();
    expect(component.dragedData.length).toEqual(0);
    expect(component.workflowDetails.name).toEqual('');
    expect(component.workflowDetails.description).toEqual('');
    expect(component.getDropData.emit).toHaveBeenCalledWith(component.workflowDetails);
  });

  it('should call workflow properties', () => {
    component.workflowDetails = {
      name: 'w1',
      description: 'description of w1',
      template: 'workflow-prop'
    };
    spyOn(component.getDropData, 'emit');
    component.workflowProperties();
    fixture.detectChanges();
    expect(component.getDropData.emit).toHaveBeenCalledWith(component.workflowDetails);
  });

  xit('should call nodeStatus function to get the error object', () => {
   component.errorJson = errorJson;
   const item = {
     id : 'node_1_ServiceNow'
   };
   const node = component.nodeStatus(item);
   expect(node).toEqual(errorJson.tasks[0]);
  });

  it('should call testWorkflow function to test the connection', () => {
    component.testWorkflow();
    expect(component.testConnectionAction).toBeTruthy();
  });

  // xit('should call showMessageDialog function to show the error details of the node', () => {
  //   component.errorJson = errorJson;
  //   const item = {
  //     id : 'node_1_ServiceNow'
  //   };
  //   component.showMessageDialog(item);
  //   spyOn(component, 'nodeStatus').and.returnValue(item);
  //   component.nodeStatus(item);
  //   expect(component.nodeStatus).toHaveBeenCalled();
  //  });

});
