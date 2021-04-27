import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SoapService } from './soap-client.service';
import { IwsdlProperties } from '../../workflow.interface';
import { IRequestBody } from '../../workflow.interface';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AddEditConnectionComponent } from 'src/app/pages/connections/add-edit-connection/add-edit-connection.component';
import { MatDialog } from '@angular/material/dialog';
import { ConnectionService } from '../../../connections/connection.service';
import { UtilsService } from '../../../shared/utils.service';
import { CustomHeaderComponent } from '../../properties-panel/custom-header/custom-header-field';
import { Connection } from 'jsplumb';
import { MatTableDataSource } from '@angular/material/table';
import { WorkflowService } from '../../workflow.service';

@Component({
  selector: 'sapper-soap-client',
  templateUrl: './soap-client.component.html',
  styleUrls: ['./soap-client.component.scss']
})
export class SoapClientComponent implements OnInit {
  wsdlURL: string;
  isAddressing: true;
  //  getOperationsList: getOperationsList;
  // @Input() connectionId;
  @Input() set connectionId(connectionid) {
    if (connectionid) {
      this.selectedConnectionId = connectionid;
    } else {
      this.selectedConnectionId = undefined;
    }
  }
  @Input() droppedNode;
  @Input() dragDataObj;
  operationsDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['name'];
  length = 0;
  pageSize = 10;

  // @Input() set taskDetails(taskDetails) {
  //   if (taskDetails) {
  //     this.taskProperties = taskDetails;
  //   } else {
  //     this.taskProperties = {
  //       name: '',
  //       documentation: '',
  //       serviceEndPointNamespace: '',
  //       portTypeName: '',
  //       operationName: '',
  //       serviceName: '',
  //       soapOperationNamespace: '',
  //       requestObjectName: '',
  //       responseObjectName: '',
  //       requestBody: null,
  //       url: '',
  //       application: '',
  //       version: '',
  //     };
  //   }
  // }
  selectedConnection;
  searchOperation;
  operationSearchText = '';
  selectedOperationName: string = null;
  connections: any = [];
  connectionList: any[];
  selectedConnectionId: any;
  selectedConnectionType;
  allOperations: any;
  versionsMap: any = {};

  @Input() set soapTaskDetails(soapTaskDetails) {
    if (soapTaskDetails) {
      this.taskProperties = soapTaskDetails.soapTaskProperties;
      this.selectedOperationName = soapTaskDetails.soapTaskProperties.operationName;
      if (this.taskProperties.requestBody) {
        this.taskProperties.requestBody = this.taskProperties.requestBody.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        this.reqBodyOptions = this.utilsService.createFroalaOptions('', this.taskProperties.requestBody);
      }
    }
    else {
      this.taskProperties = {
        name: '',
        documentation: '',
        serviceEndPointNamespace: '',
        portTypeName: '',
        operationName: '',
        serviceName: '',
        soapOperationNamespace: '',
        requestObjectName: '',
        responseObjectName: '',
        requestBody: null,
        url: '',
        application: '',
        version: '',
        bindingName: '',
        isAddressing: false,
        customHeaderList: []
      };

    }
  }
  objectName: string;
  apllicationName: string;
  metaId: any;
  operations = [];
  applications: [];
  version: [];
  reqBodyOptions;




  taskProperties: IwsdlProperties = {
    name: '',
    documentation: '',
    serviceEndPointNamespace: '',
    portTypeName: '',
    operationName: '',
    serviceName: '',
    soapOperationNamespace: '',
    requestObjectName: '',
    responseObjectName: '',
    requestBody: null,
    url: '',
    application: '',
    version: '',
    bindingName: '',
    isAddressing: false,
    customHeaderList: []
  };

  RequestBody: IRequestBody = {
    documentation: '',
    serviceEndPointNamespace: '',
    portTypeName: '',
    operationName: '',
    serviceName: '',
    soapOperationNamespace: '',
    requestObjectName: '',
    responseObjectName: '',
    url: '',
    bindingName: '',
  };

  constructor(
    private dialog: MatDialog,
    private soapService: SoapService,
    private connectionService: ConnectionService,
    private utilsService: UtilsService,
    private workflowService: WorkflowService
  ) {
    this.reqBodyOptions = this.utilsService.createFroalaOptions('');
  }

  ngOnInit(): void {
    this.workflowService.propertySave.subscribe((data) => {
      if (this.droppedNode.sapper_prop.sappertasktype === data) {
        if (this.taskProperties.requestBody.includes('<span')) {
          this.taskProperties.requestBody = this.utilsService.convertSlotToTemp(this.taskProperties.requestBody);
        }
      }
    });
    this.soapService.getApplication().subscribe(data => {
      this.applications = data.data;
      data.data.forEach((d) => {
        this.versionsMap[d.name] = d.versions;
      });
    });

    this.connectionService.getConnectionListingByType('SOAP').subscribe(data => {
      this.connections = data.data;
    });

    this.selectedConnectionId = this.droppedNode.connectionId;
  }

  clearSearch(): void {
    this.searchOperation = '';
  }

  onOperationPageChange(event) {
    if (event.pageIndex * this.pageSize > this.allOperations.length) {
      return;
    }
    this.operations = this.allOperations.slice(event.pageIndex * this.pageSize, (event.pageIndex * this.pageSize) + this.pageSize);
  }

  getWsdlByApplicationName(applicationName) {
    this.soapService.getWsdlByApplicationName(applicationName).subscribe(data => {
      this.taskProperties.url = data.data;
    });
  }

  getWsdlOperations(): void {
    this.selectedOperationName = null;
    this.soapService.getWsdlOperations(this.taskProperties.url).subscribe(data => {
      this.allOperations = data.data.map(d => ({
        ...d,
        name: d.operationName
      }));
      this.length = this.allOperations.length;

      this.operations = this.allOperations.slice(0, 9);

    });
  }

  openCreateConnectionDialog(connection) {
    const connectionDataCopy = Object.assign({}, this.selectedConnection);
    connection = this.connections.find((conn) => {
      return conn.id === this.selectedConnectionId;
    });
    const data = connection ? connection : {};
    const dialogRef = this.dialog.open(AddEditConnectionComponent, { data, width: '800px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getConnectionsByType();
      }
    });
  }

  openCustomDialog(): void {
    const dialogRef = this.dialog.open(CustomHeaderComponent,
      {
        data: this.taskProperties.customHeaderList ? JSON.parse(JSON.stringify(this.taskProperties.customHeaderList)) : [],
        width: '800px'
      });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskProperties.customHeaderList = result;
      }
    });
  }

  getConnectionsByType() {
    this.connectionService.getConnectionListingByType(this.droppedNode.sapper_prop.connectionType).subscribe(data => {
      this.connectionList = data.data;
      if (this.selectedConnection) {
        this.connectionList.forEach(connection => {
          if (connection.id === this.selectedConnection.id) {
            this.selectedConnection = connection;
          }
        });
      }
    });
  }

  // uploadMeta(): void {
  //   this.soapService.uploadMeta(this.wsdlURL).subscribe(data => {
  //     this.operations = data.data;
  //   }
  // getApplication(): void {
  //   this.soapService.getApplication().subscribe(data => {
  //     this.operations = data.data;
  //   });
  // }
  getResponse(requestBody: IRequestBody): void {
    requestBody.documentation = this.taskProperties.documentation;
    requestBody.serviceEndPointNamespace = this.taskProperties.serviceEndPointNamespace;
    requestBody.portTypeName = this.taskProperties.portTypeName;
    requestBody.operationName = this.taskProperties.operationName;
    requestBody.serviceName = this.taskProperties.serviceName;
    requestBody.soapOperationNamespace = this.taskProperties.soapOperationNamespace;
    requestBody.requestObjectName = this.taskProperties.requestObjectName;
    requestBody.responseObjectName = this.taskProperties.responseObjectName;
    requestBody.url = this.taskProperties.url;
    requestBody.bindingName = this.taskProperties.bindingName;


    this.soapService.getResponse(requestBody).subscribe(data => {
      this.taskProperties.requestBody = data.message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    });
  }

  onSelectOperation(operation) {
    this.taskProperties = {
      ...operation,
      url: this.taskProperties.url,
      version: this.taskProperties.version,
      application: this.taskProperties.application
    };
  }
}
