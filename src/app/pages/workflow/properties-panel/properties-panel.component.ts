import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';
import { animate, style, trigger, transition } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { PropertiesPanelService } from './properties-panel.service';
import { INode, ISaveTaskProperties } from '../workflow.interface';
import { UtilsService } from '../../shared/utils.service';
import { ScheduleService } from '../../schedule/schedule.service';
import { MetaConnectionComponent } from '../meta-connection/meta-connection.component';
import { WorkflowService } from '../workflow.service';
import { ConnectionService } from '../../connections/connection.service';
import { DataSlotsComponent } from './data-slots/data-slots.component';
import { MessageService } from '../../shared/services/message.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../confirm-dialog/confirm-dialog.component';
import { MappingService } from '../../mapping/mapping.service';
import { WorkflowWindowService } from '../workflow-window/workflow-window.service';
import { SoapService } from './soap-client/soap-client.service';
import { AdditionalPropertiesOptions } from './properties.interface';
import {
  CollectorProperties, CSVConverterProperties,
  CSVParserProperties, FixedWidthParserProperties,
  FTPSinkProperties, FTPSourceProperties, HTTPTaskProperties,
  SoapProperties, SqlClientProperties, SubProcessProperties, TransformationProperties
} from './properties';
import { jsPlumb } from 'jsplumb';
import { WorkflowConstant } from '../workflow-constant.providers';

@Component({
  selector: 'sapper-properties-panel',
  templateUrl: './properties-panel.component.html',
  styleUrls: ['./properties-panel.component.scss'],
  animations: [
    trigger('customAnm', [
      transition('* => true', [
        style({ transform: 'translateX(200px)' }),
        animate('0.5s ease-out', style({ transform: 'translateX(0px)' })),
      ]),
    ]),
  ],
})
export class PropertiesPanelComponent implements OnDestroy, OnInit {
  @Input() workflow;
  @Input() mappingDetails;
  @Input() dragdataObj;
  @Input() isOpenLeftSideBar;
  soapTaskProperties: any;
  @Input() set schedule(schedule) {
    if (schedule) {
      this.settings.disable_schedule = schedule.schedulerPaused;
    }
  }
  @Output() isShowMapping = new EventEmitter();
  @Output() saveWorkflow = new EventEmitter();
  @ViewChild('tpSource') tpSourceData;
  @ViewChild('soapClient') soapClientData;

  @ViewChild('tpSink') tpSinkData;
  @ViewChild('dataSlots') dataSlotsData: DataSlotsComponent;
  @ViewChild('httpClient') httpClient;
  @ViewChild('csvParser') csvParser;
  @ViewChild('csvConverter') csvConverterData;
  @ViewChild('keyProperties') keyProperties;
  @ViewChild('transformation') transformation;
  @ViewChild('sqlClient') sqlClient;
  @ViewChild('fixedWidthParser') fixedWidthParserData;
  @ViewChild('drawer') drawer;
  @ViewChild('collector') collectorData;
  properties;
  httpClientConnectionType;
  taskProperties;
  propertyTemplate = 'workflow-prop';
  isDataSlotOpen = false;
  rightPanelData: INode = {
    name: '',
    description: '',
    connectionId: '',
    propertiesType: '',
    type: '',
    metaId: '',
    propertiesId: '',
    connectionType: '',
    subProcessInputDataItem: '',
  };
  webhookPath;
  workflowData = { name: '', description: '' };
  displayTab = 'properties';
  custAnm = 'false';
  workflowProperties = true;
  options = [{ option: 'Disable Schedule', field: 'disable_schedule' }];
  settings = { disable_schedule: true };
  connectionList: any[];
  quote = '"';
  metaData: { meta: string };
  filetype: string;
  connectionsList;
  selectedConnection;
  parentData;
  iterationObjectOptions;
  control = new FormControl();
  filteredAdditionalPropertiesOptions: Observable<AdditionalPropertiesOptions[]>;
  isQueryVerified = true;
  jsPlumbInstance;
  subscription: Subscription;
  height = 60;
  scrollHeight = 90;
  scrollInnerHeight = 70;
  y = 20;
  oldY = 0;
  grabber = false;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.grabber) {
      return;
    }
    if (event.clientY < 250) { return; }
    this.resizer(event.clientY - this.oldY);
    this.oldY = event.clientY;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.grabber = false;
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (!event.srcElement['className'].includes('grabber')) { return; }
    this.grabber = true;
    this.oldY = event.clientY;
    event.preventDefault();
  }

  constructor(
    public workflowConstant: WorkflowConstant,
    public dialog: MatDialog,
    public scheduleService: ScheduleService,
    public utilService: UtilsService,
    private propertiesPanelService: PropertiesPanelService,
    private workflowService: WorkflowService,
    private connectionService: ConnectionService,
    readonly messageSevice: MessageService,
    private workflowWindowService: WorkflowWindowService,
    readonly mappingService: MappingService,
    private soapService: SoapService
  ) { }

  resizer(offsetY: number) {
    this.height -= offsetY;
    this.scrollHeight = this.height - 60;
    this.scrollInnerHeight = this.height - 90;
  }

  ngOnInit(): void {
    this.jsPlumbInstance = jsPlumb.getInstance();
    this.iterationObjectOptions = this.utilService.createFroalaOptions('');
    this.subscription = this.workflowConstant.getMessage().subscribe((message) => {
      if (message.text === 'showConnectionNode' && message.connection && message.connection.sourceID) {
        let node = this.dragdataObj[message.connection.sourceID];
        if (!node) {
          const groupId = this.jsPlumbInstance.getGroupFor(message.connection.sourceID);
          if (groupId) {
            node = this.dragdataObj[groupId.id].child[message.connection.sourceID];
            this.getNodeDetails(node, this.dragdataObj[groupId.id].child);
          }
        } else {
          this.getNodeDetails(node);
        }
      }
    });
  }

  openCloseTab(tabname: any): void {
    this.displayTab = tabname;
    this.custAnm = 'true';
    if (this.keyProperties) {
      this.keyProperties.data = [{ key: '', value: '' }];
      this.keyProperties.additionalProperties = {};
    }
  }

  /**
   * to set properties in right panel
   * @param $event: any
   * @returns void
   */
  getNodeDetails(event, parentData?): void {
    this.isDataSlotOpen = false;
    if (event) {
      this.propertyTemplate = event.template ? event.template : '';
      this.drawer.close();
      this.parentData = parentData;
      this.workflowProperties = event.template === 'workflow-prop';
      this.openCloseTab(this.displayTab);
      this.rightPanelData = event;
      this.webhookPath = `https://trigger-test.sapper.ai/webhook/${this.workflow.process.processProp.id}`;
      if (this.rightPanelData.connectionId) {
        this.getConnectionById(this.rightPanelData.connectionId);
      } else {
        if (
          this.rightPanelData &&
          this.rightPanelData.sapper_prop &&
          this.rightPanelData.sapper_prop.sappertasktype === 'TP_HTTP' && this.httpClient
        ) {
          this.httpClientConnectionType = undefined;
          this.selectedConnection = undefined;
          if (this.httpClient) {
            this.httpClient.selectedConnectionType = undefined;
            this.httpClient.selectedConnection = undefined;
          }
        } else if (this.tpSourceData) {
          this.selectedConnection = this.tpSourceData.selectedConnection =
            undefined;
        } else if (this.soapClientData) {
          this.selectedConnection = this.soapClientData.selectedConnection =
            undefined;
        } else if (this.tpSinkData) {
          this.selectedConnection = this.tpSinkData.selectedConnection =
            undefined;
        } else if (this.sqlClient) {
          this.selectedConnection = this.sqlClient.selectedConnection =
            undefined;
        }
      }
      this.onChangeTask(this.rightPanelData.sapper_prop.sappertasktype);
      if (this.rightPanelData.propertiesId) {
        this.getTaskPropertiesById(this.rightPanelData.propertiesId);
      }
    }
  }

  onChangeTask(taskType): void {
    switch (taskType) {
      case 'FTP_SOURCE_SERVICE' || 'SFTP_SOURCE_SERVICE':
        this.taskProperties = new FTPSourceProperties();
        break;
      case 'FTP_SINK_SERVICE' || 'SFTP_SINK_SERVICE':
        this.taskProperties = new FTPSinkProperties();
        break;
      case 'TP_HTTP':
        this.taskProperties = new HTTPTaskProperties();
        break;
      case 'TP_SQL':
        this.taskProperties = new SqlClientProperties();
        break;
      case 'TP_SOAP':
        this.taskProperties = new SoapProperties();
        break;
      case 'TRANSFORMATION':
        this.taskProperties = new TransformationProperties();
        break;
      case 'subProcess':
        this.taskProperties = new SubProcessProperties();
        break;
      case 'CSV_PARSER':
        this.taskProperties = new CSVParserProperties();
        break;
      case 'CSV_CONVERTER':
        this.taskProperties = new CSVConverterProperties();
        break;
      case 'FIXED_WIDTH_TXT_PARSER':
        this.taskProperties = new FixedWidthParserProperties();
        break;
      case 'COLLECTOR':
        this.taskProperties = new CollectorProperties();
        break;
      default:
        break;
    }
  }

  getConnectionById(connectionId) {
    if (connectionId) {
      this.connectionService
        .getConnectionListingById(connectionId)
        .subscribe((data) => {
          if (
            this.rightPanelData &&
            this.rightPanelData.sapper_prop &&
            this.rightPanelData.sapper_prop.sappertasktype === 'TP_HTTP'
          ) {
            this.httpClientConnectionType = this.httpClient.selectedConnectionType =
              data.data.type;
            this.getConnectionsByType(
              this.httpClientConnectionType,
              connectionId
            );
            this.selectedConnection = this.httpClient.selectedConnection =
              data.data;
          } else if (this.tpSourceData) {
            this.selectedConnection = this.tpSourceData.selectedConnection =
              data.data;
          } else if (this.tpSinkData) {
            this.selectedConnection = this.tpSinkData.selectedConnection =
              data.data;
          } else if (this.sqlClient) {
            this.selectedConnection = this.sqlClient.selectedConnection =
              data.data;
          }
        });
    } else {
      if (
        this.rightPanelData &&
        this.rightPanelData.sapper_prop &&
        this.rightPanelData.sapper_prop.sappertasktype === 'TP_HTTP'
      ) {
        if (this.httpClient) {
          this.httpClient.clearTaskProperties();
        }
      }
    }
  }

  getConnectionsByType(connectionType, connectionId) {
    this.connectionService
      .getConnectionListingByType(connectionType)
      .subscribe((data) => {
        this.httpClient.connectionList = data.data;
        this.httpClient.connectionList.forEach((connection) => {
          if (connection.id === connectionId) {
            this.httpClient.selectedConnection = connection;
          }
        });
      });
  }

  removeField(mappingProperties, i) {
    mappingProperties.splice(i, 1);
  }

  isShowAdditionalProperties() {
    const allowedTasks = [
      'FTP_SOURCE_SERVICE', 'FTP_SINK_SERVICE',
      'SFTP_SOURCE_SERVICE', 'SFTP_SINK_SERVICE',
      'TP_HTTP', 'CSV_PARSER', 'CSV_CONVERTER'];
    return (
      this.rightPanelData &&
      this.rightPanelData.sapper_prop && allowedTasks.includes(this.rightPanelData.sapper_prop.sappertasktype));
  }

  isShowMeta() {
    return (
      this.rightPanelData &&
      this.rightPanelData.sapper_prop &&
      (this.rightPanelData.sapper_prop.sappertasktype === 'CSV_PARSER' ||
        this.rightPanelData.sapper_prop.sappertasktype === 'CSV_CONVERTER' ||
        this.rightPanelData.sapper_prop.sappertasktype === 'TP_HTTP' ||
        this.rightPanelData.sapper_prop.sappertasktype === 'TP_SQL' ||
        this.rightPanelData.sapper_prop.sappertasktype === 'webhook-trigger' ||
        this.rightPanelData.sapper_prop.sappertasktype === 'TRANSFORMATION')
    );
  }

  /**
   * To save properties
   * @returns void
   */
  saveProperties(): void {
    this.workflowService.propertySave.next(this.rightPanelData.sapper_prop.sappertasktype);
    if (
      this.rightPanelData.sapper_prop &&
      this.rightPanelData.sapper_prop.connectionType === 'SOAP'
    ) {
      this.saveSOAPProperties();
      return;
    }
    const isSaveMeta = ['subProcess', 'TP_COLLECTOR'].includes(this.rightPanelData.sapper_prop.sappertasktype);
    if (isSaveMeta) {
      if (this.rightPanelData.subProcessInputDataItem) {
        this.rightPanelData.subProcessInputDataItem = this.utilService.dataSourceSlotToTemp(this.rightPanelData.subProcessInputDataItem);
        if (this.taskProperties.subProcessInputDataItem.includes('<span')) {
          this.rightPanelData.subProcessInputDataItem = this.utilService.dataSourceSlotToTemp(this.taskProperties.subProcessInputDataItem);
        }
        this.saveMetaForSubProcess(this.rightPanelData.subProcessInputDataItem);
      } else if (this.rightPanelData.sapper_prop.sappertasktype === 'TP_COLLECTOR') {
        this.saveMetaForCollector(this.collectorData.taskProperties.collectorInput);
      } else {
        this.saveMetaForSubProcess(
          this.utilService.dataSourceSlotToTemp(
            this.transformation.taskProperties.sourceDataObject
          )
        );
      }
      return;
    }
    if (!this.isTransformationProperties()) {
      const savedData = this.createTaskPropertiesData();
      this.taskProperties = savedData.taskProperties;
      if (
        this.rightPanelData.sapper_prop &&
        this.rightPanelData.sapper_prop.sappertasktype === 'TP_HTTP'
      ) {
        this.rightPanelData.connectionId = this.httpClient.selectedConnection.id;
      } else {
        if (!this.rightPanelData.connectionId) {
          if (this.tpSourceData) {
            this.rightPanelData.connectionId = this.tpSourceData.selectedConnection.id;
          } else if (this.tpSinkData) {
            this.rightPanelData.connectionId = this.tpSinkData.selectedConnection.id;
          } else if (this.sqlClient) {
            this.rightPanelData.connectionId = this.sqlClient.selectedConnection.id;
          }
        }
      }
      if (this.rightPanelData.propertiesId) {
        savedData.id = this.rightPanelData.propertiesId;
        this.updateTaskProperties(savedData);
      } else {
        this.saveTaskProperties(savedData);
        return;
      }
    } else if (this.isTransformationProperties()) {
      this.savePropsForTransformation();
    }
  }

  /**
   * used to save property details of workflow and tasks
   * @returns void
   */
  savePropertyDetails(): void {
    if (this.propertyTemplate === 'workflow-prop') {
      this.saveWorkflow.emit(true);
    } else {
      this.saveProperties();
    }
  }

  saveSOAPProperties() {
    const soapSavePayload = this.createSoapTaskPropertiesSavePayload();
    this.rightPanelData.connectionId = this.soapClientData.selectedConnectionId;
    if (this.rightPanelData.propertiesId && this.rightPanelData.propertiesId !== '') {
      soapSavePayload['id'] = this.rightPanelData.propertiesId;
      this.propertiesPanelService
        .updateSOAPTaskProperties(soapSavePayload)
        .subscribe((data) => {
          this.utilService.showSuccess(
            'SOAP task properties updated successfully.',
            ''
          );
          if (this.rightPanelData.metaId !== '') {
            this.updateMeta(this.rightPanelData.metaId);
          } else {
            this.getMeta();
          }
          this.rightPanelData.propertiesId = data.data.id;
          this.sendFlagForSaveWorkflow();
        });
    } else {
      this.propertiesPanelService
        .saveSOAPTaskProperties(soapSavePayload)
        .subscribe((data) => {
          this.utilService.showSuccess(
            'SOAP task properties saved successfully.',
            ''
          );
          this.getMeta();
          this.rightPanelData.propertiesId = data.data.id;
          this.sendFlagForSaveWorkflow();
        });
    }
  }

  getMeta() {
    this.soapService
      .getMeta(
        this.soapClientData.taskProperties.responseObjectName,
        this.soapClientData.taskProperties.application
      )
      .subscribe((data) => {
        this.workflowWindowService.metaId = data.data.id;
        this.rightPanelData.metaId = data.data.id;
      });
  }

  createSoapTaskPropertiesSavePayload() {
    return {
      name: 'Soap_properties',
      description: this.soapClientData.droppedNode.description,
      propertiesType: 'TP_SOAP',
      taskProperties: {
        soapTaskProperties: {
          documentation: this.soapClientData.taskProperties.documentation,
          serviceEndPointNamespace: this.soapClientData.taskProperties
            .serviceEndPointNamespace,
          portTypeName: this.soapClientData.taskProperties.portTypeName,
          operationName: this.soapClientData.taskProperties.operationName,
          serviceName: this.soapClientData.taskProperties.serviceName,
          soapOperationNamespace: this.soapClientData.taskProperties
            .soapOperationNamespace,
          requestObjectName: this.soapClientData.taskProperties
            .requestObjectName,
          responseObjectName: this.soapClientData.taskProperties
            .responseObjectName,
          requestBody: this.utilService.convertSlotToTemp(
            this.soapClientData?.reqBodyVal?.getEditor().html.get()).replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
          url: this.soapClientData.taskProperties.url,
          application: this.soapClientData.taskProperties.application,
          version: this.soapClientData.taskProperties.version,
          isAddressing: this.soapClientData.taskProperties.isAddressing,
          customHeaderList: this.soapClientData.taskProperties.customHeaderList
        },
      },
    };
  }

  updateTaskProperties(savedData) {
    this.propertiesPanelService
      .updateTaskProperties(savedData)
      .subscribe((data) => {
        if (data.data.additionalProperties) {
          this.properties = data.data.additionalProperties;
        }
        this.utilService.showSuccess(
          'Task Properties updated successfully...',
          ''
        );
        if (this.isTpSourceProperties()) {
          this.saveMetaForSource('OUTPUT', data.data.id);
        }
        if (this.isTransformationProperties() && savedData.metaProperties) {
          if (this.dragdataObj[this.rightPanelData.id]) {
            this.dragdataObj[this.rightPanelData.id].sourceMetaId = savedData.metaProperties.sourceMeta.id;
            this.dragdataObj[this.rightPanelData.id].metaId = savedData.metaProperties.targetMeta.id;
          } else {
            const groupId = this.jsPlumbInstance.getGroupFor(this.rightPanelData.id);
            if (groupId) {
              this.dragdataObj[groupId.id].child[this.rightPanelData.id].sourceMetaId = savedData.metaProperties.sourceMeta.id;
              this.dragdataObj[groupId.id].child[this.rightPanelData.id].metaId = savedData.metaProperties.targetMeta.id;
            }
          }
          this.rightPanelData.sourceMetaId = savedData.metaProperties.sourceMeta.id;
          this.rightPanelData.metaId = savedData.metaProperties.targetMeta.id;
          this.sendFlagForSaveWorkflow();
          this.isShowMapping.emit();
        }
        this.sendFlagForSaveWorkflow();
      });
  }

  saveTaskProperties(savedData) {
    this.propertiesPanelService
      .saveTaskProperties(savedData)
      .subscribe((data) => {
        if (data.data.additionalProperties) {
          this.properties = data.data.additionalProperties;
        }
        this.utilService.showSuccess(
          'Task Properties saved successfully...',
          ''
        );
        this.rightPanelData.propertiesId = data.data.id;
        if (this.isTpSourceProperties()) {
          this.saveMetaForSource('OUTPUT', data.data.id);
        }
        if (this.isTransformationProperties() && savedData.metaProperties) {
          this.rightPanelData.sourceMetaId = savedData.metaProperties.sourceMeta.id;
          this.rightPanelData.metaId = savedData.metaProperties.targetMeta.id;
          this.isShowMapping.emit();
        }
        this.sendFlagForSaveWorkflow();
      });
  }
  updateMeta(metaId) {
    this.soapService
      .updateMeta(
        this.soapClientData.taskProperties.responseObjectName,
        this.soapClientData.taskProperties.application,
        metaId
      )
      .subscribe((data) => {
        this.workflowWindowService.metaId = data.data.id;
        this.rightPanelData.metaId = data.data.id;
      });
  }

  // function call if task properties saved
  sendFlagForSaveWorkflow() {
    this.messageSevice.setMessage('Properties Saved');
    // this.saveWorkflow.emit(true);
  }

  private saveTranformationProp(isvalid, prop) {
    if (isvalid.source && isvalid.target) {
      const property = prop;
      if (property.sourceMeta.type === 'FILE' && property.sourceMeta.value._fileNames) {
        property.sourceMeta.value = property.sourceMeta.value._fileNames;
      }
      if (property.targetMeta.type === 'FILE' && property.targetMeta.value._fileNames) {
        property.targetMeta.value = property.targetMeta.value._fileNames;
      }
      const data = {
        id: '',
        name: this.rightPanelData.name,
        description: this.rightPanelData.description,
        propertiesType: this.rightPanelData.sapper_prop.sappertasktype,
        metaProperties: property,
        taskProperties: {},
        additionalProperties: this.keyProperties?.additionalProperties
      };
      if (this.rightPanelData.propertiesId) {
        data.id = this.rightPanelData.propertiesId;
        this.updateTaskProperties(data);
      } else {
        delete data.id;
        this.saveTaskProperties(data);
        return;
      }
    }
  }

  private savePropsForTransformation() {
    const props = this.taskProperties;
    const isValid = {
      source: false,
      target: false
    };
    let meta;
    let textArr = props.sourceMeta.value.split('.');
    let metaId;
    let objId = textArr[1];
    if (textArr.length < 3) {
      objId = objId.trim().replace(/'\)}/g, '');
    }
    if (this.dragdataObj[objId]) {
      metaId = this.dragdataObj[objId].metaId;
    } else {
      const groupId = this.jsPlumbInstance.getGroupFor(objId);
      if (groupId) {
        metaId = this.dragdataObj[groupId.id].child[objId].metaId;
      }
    }
    if (textArr.length > 3) {
      this.workflowService.getMeta(metaId).subscribe((response) => {
        meta = this.utilService.updateTreeViewData(JSON.parse(response.data.meta));
        meta.forEach(field => {
          if (field.name === textArr[textArr.length - 1].trim().replace(/'\)}/g, '')) {
            const metaData = { meta: '' };
            metaData.meta = JSON.stringify(field.children);
            this.workflowService.saveMeta(metaData).subscribe((res) => {
              props.sourceMeta.id = res.data.id;
              isValid.source = true;
              this.saveTranformationProp(isValid, props);
            });
          }
        });
      });
    } else {
      props.sourceMeta.id = metaId;
      isValid.source = true;
      this.saveTranformationProp(isValid, props);
    }
    if (props.targetMeta.type === 'SLOT') {
      textArr = props.targetMeta.value.split('.');
      objId = textArr[1];
      if (textArr.length < 3) {
        objId = objId.trim().replace(/'\)}/g, '');
      }
      if (this.dragdataObj[objId]) {
        metaId = this.dragdataObj[objId].metaId;
      } else {
        const groupId = this.jsPlumbInstance.getGroupFor(objId);
        if (groupId) {
          metaId = this.dragdataObj[groupId.id].child[objId].metaId;
        }
      }
      if (textArr.length > 3) {
        this.workflowService.getMeta(metaId).subscribe((response) => {
          meta = this.utilService.updateTreeViewData(JSON.parse(response.data.meta));
          meta.forEach(field => {
            if (field.name === textArr[textArr.length - 1].trim().replace(/'\)}/g, '')) {
              const metaData = { meta: '' };
              metaData.meta = JSON.stringify(field.children);
              this.workflowService.saveMeta(metaData).subscribe((res) => {
                props.targetMeta.id = res.data.id;
                isValid.target = true;
                this.saveTranformationProp(isValid, props);
              });
            }
          });
        });
      } else {
        props.targetMeta.id = metaId;
        isValid.target = true;
        this.saveTranformationProp(isValid, props);
      }
    } else if (props.targetMeta.type === 'FILE' && props.targetMeta.value._fileNames) {
      const formData = new FormData();
      formData.append('file', props.targetMeta.value._files[0]);
      formData.append('requiredProperties', `{"delimiter": null,
        "escapeChar": "\\\\",
        "escapeDisabled": null,
        "skipHeaderRecord": null,
        "ignoreEmptyLines": null,
        "quote": "\\"",
        "quoteDisabled": null}`);
      this.workflowService.uploadFile('JSON', formData).subscribe((res) => {
        props.targetMeta.id = res.data.id;
        isValid.target = true;
        this.saveTranformationProp(isValid, props);
      });
    }
  }

  /**
   * To create object required to save task properties
   * @returns ISaveTaskProperties
   */
  createTaskPropertiesData(): ISaveTaskProperties {
    let additionalProperties = this.properties;
    if (this.keyProperties) {
      additionalProperties = this.keyProperties.additionalProperties;
    }
    return {
      name: this.rightPanelData.name,
      description: this.rightPanelData.description,
      propertiesType: this.rightPanelData.sapper_prop.sappertasktype,
      taskProperties: this.taskProperties,
      additionalProperties: additionalProperties
    };
  }

  /**
   * To save dropped array as a meta for subprocess
   * @param metaField: any
   */
  saveMetaForSubProcess(metaField) {
    let meta;
    let textArr = metaField.split('.');
    let metaId = this.dragdataObj[textArr[2]].metaId;
    this.workflowService.getMeta(metaId).subscribe((response) => {
      meta = this.utilService.updateTreeViewData(
        JSON.parse(response.data.meta)
      );
      this.saveSubProcessMeta(meta, textArr);
    });
  }

  private saveSubProcessMeta(meta, textArr): void {
    meta.forEach((field) => {
      if (
        field.name ===
        textArr[textArr.length - 1].trim().replace(/',execution\)}/g, '')
      ) {
        const metaData = { meta: '' };
        metaData.meta = JSON.stringify(field.children);
        this.workflowService.saveMeta(metaData).subscribe((response) => {
          const metaIdField =
            this.rightPanelData.sapper_prop.sappertasktype === 'subProcess'
              ? 'metaId'
              : 'sourceMetaId';
          this.rightPanelData[metaIdField] = response.data.id;
          this.sendFlagForSaveWorkflow();
        });
      }
      if (field.children.length > 0) {
        this.saveSubProcessMeta(field.children, textArr);
      }
    });
  }


  /**
   * To save dropped array as a meta for collector
   * @param metaField: any
   */
  saveMetaForCollector(metaField) {
    let meta;
    let metaId;
    let textArr = metaField.split('.');
    if (textArr.length === 2) {
      textArr = textArr[1].split('\'');
      if (!this.dragdataObj[textArr[0]]) {
        const groupId = this.jsPlumbInstance.getGroupFor(textArr[0]);
        if (groupId) {
          metaId = this.dragdataObj[groupId.id].child[textArr[0]].metaId;
        }
      } else {
        metaId = this.dragdataObj[textArr[0]].metaId;
      }
      this.workflowService.getMeta(metaId).subscribe((response) => {
        const metaData = { meta: '' };
        metaData.meta = response.data.meta;
        this.saveMetaInLoop(metaData);
      });
    } else if (textArr.length === 3 && textArr[2] === 'response\')}') {
      if (!this.dragdataObj[textArr[1]]) {
        const groupId = this.jsPlumbInstance.getGroupFor(textArr[1]);
        if (groupId) {
          metaId = this.dragdataObj[groupId.id].child[textArr[1]].metaId;
        }
      } else {
        metaId = this.dragdataObj[textArr[1]].metaId;
      }
      this.workflowService.getMeta(metaId).subscribe((response) => {
        const metaData = { meta: '' };
        metaData.meta = response.data.meta;
        this.saveMetaInLoop(metaData);
      });
    } else {
      if (!this.dragdataObj[textArr[1]]) {
        const groupId = this.jsPlumbInstance.getGroupFor(textArr[1]);
        if (groupId) {
          metaId = this.dragdataObj[groupId.id].child[textArr[1]].metaId;
        }
      } else {
        metaId = this.dragdataObj[textArr[1]].metaId;
      }
    }
    this.workflowService.getMeta(metaId).subscribe((response) => {
      meta = JSON.parse(response.data.meta);
      if (!Array.isArray(meta)) {
        meta = this.utilService.updateTreeViewData(meta);
      }
      meta.forEach((field) => {
        if (
          field.name ===
          textArr[textArr.length - 1].trim().replace(/'\)}/g, '')
        ) {
          const metaData = { meta: '' };
          metaData.meta = JSON.stringify(field.children);
          this.saveMetaInLoop(metaData);
        }
      });
    });
  }

  saveMetaInLoop(metaData) {
    this.workflowService.saveMeta(metaData).subscribe((response) => {
      this.saveCollectorsInLoop(response);
      const savedData = this.createTaskPropertiesData();
      this.saveTaskProperties(savedData);

      this.sendFlagForSaveWorkflow();
    });
  }

  /**
   * To save collector details in loop
   * @param response: any
   */
  saveCollectorsInLoop(response) {
    const groupDetails = this.jsPlumbInstance.getGroupFor(this.rightPanelData.id);
    if (!this.dragdataObj[groupDetails.id].sapper_prop['collectorObject']) {
      this.dragdataObj[groupDetails.id].sapper_prop.collectorObject = {};
    }
    this.dragdataObj[groupDetails.id].sapper_prop.collectorObject[this.rightPanelData.name] = {
      id: this.rightPanelData.id,
      name: `${this.dragdataObj[groupDetails.id].name}_${this.rightPanelData.name}`,
      metaId: response.data.id,
      sapper_prop: {
        step: this.dragdataObj[groupDetails.id].sapper_prop.step
      }
    };
  }

  /**
   * To save meta for source
   * @param ioType: string
   * @param taskPropertiesId: string
   */
  saveMetaForSource(ioType, taskPropertiesId): void {
    let taskType = this.rightPanelData?.sapper_prop.sappertasktype;
    this.workflowService
      .getStandardMetaFormat(taskType, ioType, taskPropertiesId)
      .subscribe((data) => {
        this.rightPanelData['metaId'] = data.data.id;
      });
  }

  /**
   * To parse dropped string from data slot
   * @param fileName: string
   */
  parseSelectedMeta(fileName) {
    return `_SE_{_P('data.${this.rightPanelData.id}.response.${fileName}')`;
  }

  /**
   * To get task properties
   */
  getTaskPropertiesById(propertiesId) {
    if (propertiesId) {
      this.propertiesPanelService
        .getTaskProperties(propertiesId)
        .subscribe((data) => {
          if (data.data.propertiesType === 'TRANSFORMATION') {
            this.taskProperties = data.data.metaProperties;
          } else {
            this.taskProperties = data.data.taskProperties;
          }
          this.properties = data.data.additionalProperties;
        });
    }
  }

  isTpSourceProperties(): boolean {
    if (this.rightPanelData && this.rightPanelData.sapper_prop) {
      return (
        this.rightPanelData.sapper_prop.sappertasktype === 'FTP_SOURCE_SERVICE' ||
        this.rightPanelData.sapper_prop.sappertasktype === 'SFTP_SOURCE_SERVICE'
      );
    }
    return false;
  }

  isSoapClient(): boolean {
    if (this.rightPanelData && this.rightPanelData.sapper_prop) {
      return this.rightPanelData.sapper_prop.sappertasktype === 'TP_SOAP';
    }
    return false;
  }

  isTpSinkProperties(): boolean {
    if (this.rightPanelData && this.rightPanelData.sapper_prop) {
      return (
        this.rightPanelData.sapper_prop.sappertasktype === 'FTP_SINK_SERVICE' ||
        this.rightPanelData.sapper_prop.sappertasktype === 'SFTP_SINK_SERVICE'
      );
    }
    return false;
  }

  isWebhookTrigger(): boolean {
    if (this.rightPanelData && this.rightPanelData.sapper_prop) {
      return this.rightPanelData.sapper_prop.sappertasktype === 'webhook-trigger';
    }
    return false;
  }

  isHttpClientProperties(): boolean {
    if (this.rightPanelData && this.rightPanelData.sapper_prop) {
      return this.rightPanelData.sapper_prop.sappertasktype === 'TP_HTTP';
    }
    return false;
  }

  isSqlClientProperties(): boolean {
    if (this.rightPanelData && this.rightPanelData.sapper_prop) {
      return this.rightPanelData.sapper_prop.sappertasktype === 'TP_SQL';
    }
    return false;
  }

  isCsvParserProperties(): boolean {
    if (this.rightPanelData && this.rightPanelData.sapper_prop) {
      return this.rightPanelData.sapper_prop.sappertasktype === 'CSV_PARSER';
    }
    return false;
  }

  isCsvConverterProperties(): boolean {
    if (this.rightPanelData && this.rightPanelData.sapper_prop) {
      return this.rightPanelData.sapper_prop.sappertasktype === 'CSV_CONVERTER';
    }
    return false;
  }

  isTransformationProperties(): boolean {
    if (this.rightPanelData && this.rightPanelData.sapper_prop) {
      return (
        this.rightPanelData.sapper_prop.sappertasktype === 'TRANSFORMATION'
      );
    }
    return false;
  }

  isFixedWidthProperties(): boolean {
    if (this.rightPanelData && this.rightPanelData.sapper_prop) {
      return (
        this.rightPanelData.sapper_prop.sappertasktype ===
        'FIXED_WIDTH_TXT_PARSER'
      );
    }
    return false;
  }

  isCollectorTaskProperties(): boolean {
    if (this.rightPanelData && this.rightPanelData.sapper_prop) {
      return this.rightPanelData.sapper_prop.sappertasktype === 'TP_COLLECTOR';
    }
    return false;
  }


  /**
   * Used to update workflow level schedule settings
   * @param option: any
   * @returns void
   */
  updateSchedule(option): void {
    this.settings[option.field] = !this.settings[option.field];
    const schedule = { id: this.workflow ? this.workflow.workflowId : null };
    if (this.settings[option.field]) {
      this.scheduleService.disableSchedule(schedule).subscribe((message) => {
        message = this.utilService.fetchResponseData(message);
        this.utilService.showSuccess(message, '');
      });
    } else {
      this.scheduleService.enableSchedule(schedule).subscribe((message) => {
        message = this.utilService.fetchResponseData(message);
        this.utilService.showSuccess(message, '');
      });
    }
  }

  propertiesTabChange(event) {
    this.openCloseTab(event.tab.textLabel);
  }

  validateTaskProperties() {
    if (
      this.rightPanelData &&
      this.rightPanelData.sapper_prop &&
      this.rightPanelData.sapper_prop.sappertasktype === 'TP_HTTP'
    ) {
      if (this.httpClient) {
        if (this.httpClient.taskProperties.httpMethod !== 'GET') {
          return this.httpClient.taskProperties.requestBody;
        }
        return (
          this.rightPanelData.name &&
          this.httpClient.connectionType &&
          this.httpClient.selectedConnection &&
          this.httpClient.taskProperties.apiURI &&
          this.httpClient.taskProperties.httpMethod &&
          this.httpClient.taskProperties.requestContentType &&
          this.httpClient.taskProperties.responseContentType
        );
      }
    } else {
      return true;
    }
  }

  // check type for meta tab
  checkTypeForMeta() {
    return (
      this.rightPanelData && this.rightPanelData.sapper_prop &&
      ['FTP_SOURCE_SERVICE', 'FTP_SINK_SERVICE', 'TP_HTTP', 'TP_SOAP'].includes(this.rightPanelData.sapper_prop.sappertasktype));
  }

  /**
   * Used to validate the save button of properties pannel
   * @returns boolean
   */
  isSaveDisabled(): boolean {
    if (this.rightPanelData && this.rightPanelData.sapper_prop &&
      this.rightPanelData.sapper_prop.connectionType === 'SOAP' &&
      this.soapClientData &&
      this.soapClientData.taskProperties.application === null
    ) {
      return false;
    }
    if (this.isTransformationProperties && this.transformation) {
      return this.transformation.taskProperties.sourceDataObject.length > 0;
    }
    if (this.isSqlClientProperties() && this.sqlClient) {
      const batchExp = this.sqlClient.taskProperties.isBatchExecution
        ? this.sqlClient.taskProperties.batchDataExpression
        : true;
      return (
        this.sqlClient.taskProperties.queryType &&
        this.sqlClient.taskProperties.query &&
        this.isQueryVerified &&
        batchExp
      );
    }
    return true;
  }

  saveFixedWidthMeta(event) {
    this.rightPanelData.metaId = event.data.id;
    this.sendFlagForSaveWorkflow();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
