import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditConnectionComponent } from 'src/app/pages/connections/add-edit-connection/add-edit-connection.component';
import { ConnectionService } from '../../../connections/connection.service';
import { UtilsService } from '../../../shared/utils.service';
import 'froala-editor/js/plugins.pkgd.min.js';
import { WorkflowConstant } from '../../workflow-constant.providers';
import { WorkflowService } from '../../workflow.service';

@Component({
  selector: 'sapper-http-client',
  templateUrl: './http-client.component.html',
  styleUrls: ['./http-client.component.scss']
})
export class HttpClientComponent implements OnInit {

  httpMethods = ['GET', 'POST', 'PUT', 'PATCH'];
  contentTypes = ['JSON'];
  public headerArr = [{ headerKey: '', headerValue: '' }];
  public queryParamArr = [{ headerKey: '', headerValue: '' }];
  httpHeaders = {};
  queryParameters = {};
  selectedConnection;
  connectionList: any[];
  taskProperties = {
    name: '',
    apiURI: '',
    httpMethod: '',
    requestBody: '',
    queryParameters: this.queryParameters,
    httpHeaders: this.httpHeaders,
    responseContentType: '',
    requestContentType: ''
  };
  connectionType = [
    {
      key: 'Rest Token',
      value: 'REST_TOKEN'
    }, {
      key: 'Rest API Key',
      value: 'REST_API_KEY'
    }, {
      key: 'Rest Basic',
      value: 'REST_BASIC'
    }, {
      key: 'Rest OAuth',
      value: 'REST_OAUTH2'
    }];
  selectedConnectionType;
  urlOptions;
  reqBodyOptions;

  @Input() droppedNode;
  @Input() set httpClientConnectionType(httpClientConnectionType) {
    this.selectedConnectionType = httpClientConnectionType;
  }
  @Input() set connection(connection) {
    if (this.selectedConnectionType) {
      this.getConnectionsByType(this.selectedConnectionType);
      this.selectedConnection = connection;
    }
  }
  @Input() set taskDetails(taskDetails) {
    if (taskDetails) {
      this.taskProperties = taskDetails;
      if (this.taskProperties.httpHeaders || this.taskProperties.queryParameters) {
        this.setHeaders();
      }
      if (this.taskProperties.apiURI) {
        this.urlOptions = this.utilsService.createFroalaOptions('', this.taskProperties.apiURI);
      }
      if (this.taskProperties.requestBody) {
        this.reqBodyOptions = this.utilsService.createFroalaOptions('', this.taskProperties.requestBody);
      }
    }
  }
  @Input() dragDataObj;
  constructor(
    private dialog: MatDialog,
    private connectionService: ConnectionService,
    private utilsService: UtilsService,
    public workflowConstant: WorkflowConstant,
    private workflowService: WorkflowService
  ) {
    this.urlOptions = this.utilsService.createFroalaOptions('');
    this.reqBodyOptions = this.utilsService.createFroalaOptions('');
  }

  ngOnInit(): void {
    this.workflowService.propertySave.subscribe((data) => {
      if (this.droppedNode.sapper_prop.sappertasktype === data) {
        this.taskProperties.httpHeaders = Object.assign({}, this.httpHeaders);
        this.taskProperties.queryParameters = Object.assign({}, this.queryParameters);
      }
      if (this.taskProperties.apiURI.includes('<span')) {
        this.taskProperties.apiURI = this.utilsService.convertSlotToTemp(this.taskProperties.apiURI);
      }
      if (this.taskProperties.requestBody && this.taskProperties.requestBody.includes('<span')) {
        this.taskProperties.requestBody = this.utilsService.convertSlotToTemp(this.taskProperties.requestBody);
      }
    });
  }

  setHeaders() {
    this.httpHeaders = {};
    this.queryParameters = {};
    this.headerArr = [{ headerKey: '', headerValue: '' }];
    this.queryParamArr = [{ headerKey: '', headerValue: '' }];
    if (this.taskProperties.httpHeaders) {
      if (Object.keys(this.taskProperties.httpHeaders).length) {
        this.headerArr = [];
      }
      for (const key of Object.keys(this.taskProperties.httpHeaders)) {
        this.headerArr.push({ headerKey: key, headerValue: this.taskProperties.httpHeaders[key] });
        if (key && key.trim().length > 0) {
          this.httpHeaders[key] = this.taskProperties.httpHeaders[key];
        }
      }
    }
    if (this.taskProperties.queryParameters) {
      if (Object.keys(this.taskProperties.queryParameters).length) {
        this.queryParamArr = [];
      }
      for (const key of Object.keys(this.taskProperties.queryParameters)) {
        this.queryParamArr.push({ headerKey: key, headerValue: this.taskProperties.queryParameters[key] });
        if (key && key.trim().length > 0) {
          this.queryParameters[key] = this.taskProperties.queryParameters[key];
        }
      }
    }
  }

  clearTaskProperties() {
    this.selectedConnection = {};
    this.selectedConnectionType = '';
    this.queryParameters = {};
    this.httpHeaders = {};
    this.headerArr = [{ headerKey: '', headerValue: '' }];
    this.queryParamArr = [{ headerKey: '', headerValue: '' }];
    this.taskProperties = {
      name: '',
      apiURI: '',
      httpMethod: '',
      requestBody: '',
      queryParameters: this.queryParameters,
      httpHeaders: this.httpHeaders,
      responseContentType: '',
      requestContentType: ''
    };
  }

  onChangeOfHeadersAndParams(row, index, type) {
    if (type === 'queryParam') {
      delete this.queryParameters[Object.keys(this.queryParameters)[index]];
      this.queryParameters[row.headerKey] = row.headerValue;
    }
    if (type === 'httpHeader') {
      delete this.httpHeaders[Object.keys(this.httpHeaders)[index]];
      this.httpHeaders[row.headerKey] = row.headerValue;
    }
  }

  openCreateConnectionDialog(connection) {
    const connectionDataCopy = Object.assign({}, this.selectedConnection);
    const data = connection ? this.selectedConnection : {};
    const dialogRef = this.dialog.open(AddEditConnectionComponent, { data, width: '800px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getConnectionsByType(this.selectedConnectionType);
      }
    });
  }

  getConnectionsByType(type) {
    // this.selectedConnectionType = this.droppedNode.connectionType;
    this.connectionService.getConnectionListingByType(type).subscribe(data => {
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

  addField(type): void {
    if (type === 'httpHeader') {
      this.headerArr.push({ headerKey: '', headerValue: '' });
    } else {
      this.queryParamArr.push({ headerKey: '', headerValue: '' });
    }
  }

  onDeleteRow(divId, rowId, key, type) {
    const element = document.getElementById(divId);
    element.remove();
    if (type === 'httpHeader') {
      this.headerArr.splice(rowId, 1);
    } else {
      this.queryParamArr.splice(rowId, 1);
    }
  }

}
