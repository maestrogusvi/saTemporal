import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConnectionService } from './../connection.service';
import { UtilsService } from '../../shared/utils.service';
import { IConnections } from '../connections.interface';
import { AppStoreService } from '../../app-store/app-store.service';
import { IApplicationLov } from '../../app-store/app-store.interface';

@Component({
  selector: 'sapper-add-edit-connection',
  templateUrl: './add-edit-connection.component.html',
  styleUrls: ['./add-edit-connection.component.scss']
})
export class AddEditConnectionComponent implements OnInit {
  selectedApplication: IApplicationLov = {
    id: '',
    name: ''
  };
  connectionForm: FormGroup;
  connectionTypeControl: FormControl;
  @ViewChild('addEditConnection') addEditConnection: TemplateRef<any>;
  @ViewChild('restConnection') restConnection;
  connectionType = [{
    key: 'S3',
    value: 'S3'
  }, {
    key: 'FTP',
    value: 'FTP'
  },
  {
    key: 'SFTP',
    value: 'SFTP'
  },
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
  }, {
    key: 'SQL',
    value: 'SQL'
  },
  {
    key: 'SOAP',
    value: 'SOAP'
  }];
  searchApp;

  connectionData: IConnections;
  applicationList: IApplicationLov[];
  connectionDataOnEdit: IConnections;
  public enableBtnSave = false;
  file: File;

  constructor(
    public dialogRef: MatDialogRef<AddEditConnectionComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private utilsService: UtilsService,
    private connectionService: ConnectionService,
    private appStoreService: AppStoreService) {

    this.connectionDataOnEdit = data;
  }

  ngOnInit(): void {
    if (this.connectionDataOnEdit.id) {
      this.connectionData = this.connectionDataOnEdit;
    } else {
      this.connectionData = {
        name: '',
        type: '',
        description: '',
        applicationId: this.selectedApplication.id,
        applicationName: this.selectedApplication.name,
        connectionProperties: {
        }
      };
    }
    this.getApplicationList();
    this.createForm();
  }
  /**
   * This function is used for define the structure of connction form.
   */
  createForm() {
    this.connectionForm = new FormGroup({
    });
  }

  /**
   * check type of connection and load template
   */
  checkType() {
    if (this.connectionData && (this.connectionData.type === 'REST_TOKEN' || this.connectionData.type === 'REST_BASIC' ||
      this.connectionData.type === 'REST_API_KEY') && this.connectionData.connectionProperties) {
      return true;
    } else {
      return false;
    }
  }

  onChangeType() {
    if (this.connectionData.type === 'REST_API_KEY') {
      this.connectionData.connectionProperties = Object.assign(this.connectionData.connectionProperties,
        { key: '', value: '', addTo: this.getAddToValue() });
      delete this.connectionData.connectionProperties.httpHeaders;
      delete this.connectionData.connectionProperties.queryParams;
    } else if (this.connectionData.type === 'REST_OAUTH2') {
      this.connectionData.connectionProperties.grantType = '';
    } else if (this.connectionData.type === 'SQL') {
      delete this.connectionData.connectionProperties.httpHeaders;
      delete this.connectionData.connectionProperties.queryParams;
    }
    this.connectionData.name = '';
    this.connectionData.description = '';
    this.clearConnectionProperties();
    if (this.connectionData) {
      if (this.connectionData.type === 'REST_TOKEN' || this.connectionData.type === 'REST_BASIC') {
        this.connectionData.connectionProperties = {
          httpHeaders: {},
          queryParams: {}
        };
      }
      if (this.connectionData.type === 'REST_API_KEY') {
        this.connectionData.connectionProperties = Object.assign(this.connectionData.connectionProperties,
          { key: '', value: '', addTo: this.getAddToValue() });
        delete this.connectionData.connectionProperties.httpHeaders;
        delete this.connectionData.connectionProperties.queryParams;
      }
      if (this.connectionData.type === 'REST_OAUTH2') {
        this.connectionData.connectionProperties.grantType = '';
      }
      this.connectionData.name = '';
      this.connectionData.description = '';
    }
  }

  testConnection() {
    this.connectionService.testConnection(this.connectionData).subscribe(data => {
      this.utilsService.showSuccess('Connection tested successfully...', '');
      this.enableBtnSave = true;
    });
  }

  /**
   * Used to get the latest value of addTo Field
   * @returns string
   */
  private getAddToValue(): string {
    return this.connectionData.connectionProperties.addTo ? this.connectionData.connectionProperties.addTo : 'HEADER';
  }

  /**
   * To save connection
   * @returns void
   */
  saveConnection(): void {
    this.connectionData.applicationId = this.selectedApplication.id;
    this.connectionData.applicationName = this.selectedApplication.name;
    this.connectionService.saveConnection(this.connectionData).subscribe(data => {
      this.utilsService.showSuccess('Connection saved successfully...', '');
      this.dialogRef.close(true);
    });
  }

  /**
   * To get applications
   * @returns void
   */
  getApplicationList(): void {
    this.appStoreService.getAllApplicationsLov().subscribe(data => {
      this.applicationList = data.data;
      if (this.connectionData.id) {
        this.applicationList.forEach(application => {
          if (application.id === this.connectionData.applicationId) {
            this.selectedApplication = application;
          }
        });
      }
    });
  }

  /**
   * Used to check is application show
   * @returns boolean
   */
  isShowApplication(): boolean {
    return ['FTP', 'S3', 'SFTP', 'SOAP'].indexOf(this.connectionData.type) === -1;
  }

  /**
   * Used to validate connections
   */
  validateConnection() {
    if (this.connectionData.type && this.connectionData.name && this.selectedApplication.id) {
      switch (this.connectionData.type) {
        case 'FTP':
          return this.connectionData.connectionProperties.hostName &&
            this.connectionData.connectionProperties.port &&
            this.connectionData.connectionProperties.username &&
            this.connectionData.connectionProperties.password;
        case 'SOAP':
          if (this.connectionData.connectionProperties.passwordTypeEnum &&
            this.connectionData.connectionProperties.password) {
            this.enableBtnSave = true;
            return true;
          } else {
            this.enableBtnSave = false;
            return false;
          }
        case 'S3':
          return this.connectionData.connectionProperties.bucketName &&
            this.connectionData.connectionProperties.accessKey &&
            this.connectionData.connectionProperties.secretAccessKey &&
            this.connectionData.connectionProperties.region;
        case 'SFTP':
          return this.connectionData.connectionProperties.sftpConnectionType &&
            this.connectionData.connectionProperties.hostName &&
            this.connectionData.connectionProperties.port &&
            this.connectionData.connectionProperties.username &&
            this.connectionData.connectionProperties.password;
        case 'REST_TOKEN':
          if (this.connectionData.connectionProperties.httpMethod !== 'GET') {
            return this.connectionData.connectionProperties.requestBody;
          }
          return this.connectionData.connectionProperties.authorizationUrl &&
            this.connectionData.connectionProperties.httpMethod &&
            this.connectionData.connectionProperties.contentType &&
            this.connectionData.connectionProperties.headerField &&
            (this.connectionData.connectionProperties.headerPrefix === '' || this.connectionData.connectionProperties.headerPrefix);
        case 'REST_BASIC':
          if (this.connectionData.connectionProperties.httpMethod !== 'GET') {
            return this.connectionData.connectionProperties.requestBody;
          }
          return this.connectionData.connectionProperties.username &&
            this.connectionData.connectionProperties.password &&
            this.connectionData.connectionProperties.authorizationUrl &&
            this.connectionData.connectionProperties.httpMethod &&
            this.connectionData.connectionProperties.contentType &&
            this.connectionData.connectionProperties.headerField &&
            (this.connectionData.connectionProperties.headerPrefix === '' || this.connectionData.connectionProperties.headerPrefix);
        case 'REST_API_KEY':
          return this.connectionData.connectionProperties.authorizationUrl &&
            this.connectionData.name &&
            this.connectionData.connectionProperties.httpMethod &&
            this.connectionData.connectionProperties.contentType &&
            this.connectionData.connectionProperties.key &&
            this.connectionData.connectionProperties.value;
        case 'REST_OAUTH2':
          return this.validateOAuth2(this.connectionData.connectionProperties.grantType);
        case 'SQL':
          return this.connectionData.connectionProperties.username &&
            this.connectionData.connectionProperties.password &&
            this.connectionData.connectionProperties.database &&
            this.connectionData.connectionProperties.driverClassName &&
            this.connectionData.connectionProperties.url;
        default:
          return false;
      }
    }
    return false;
  }

  /**
   * Used to validate oauth connection
   * @param string grantType
   */
  validateOAuth2(grantType) {
    if (grantType) {
      switch (grantType) {
        case 'AUTHORIZATION_CODE':
          return this.connectionData.connectionProperties.authUrl &&
            this.connectionData.connectionProperties.clientId &&
            this.connectionData.connectionProperties.clientSecret &&
            this.connectionData.connectionProperties.accessTokenUrl &&
            this.connectionData.connectionProperties.scope &&
            this.connectionData.connectionProperties.responseType &&
            this.connectionData.connectionProperties.headerField &&
            (this.connectionData.connectionProperties.headerPrefix === '' || this.connectionData.connectionProperties.headerPrefix);
        case 'PASSWORD':
          return this.connectionData.connectionProperties.username &&
            this.connectionData.connectionProperties.password &&
            this.connectionData.connectionProperties.accessTokenUrl &&
            this.connectionData.connectionProperties.clientId &&
            this.connectionData.connectionProperties.clientSecret &&
            this.connectionData.connectionProperties.headerField &&
            (this.connectionData.connectionProperties.headerPrefix === '' || this.connectionData.connectionProperties.headerPrefix);
        case 'CLIENT_CREDENTIALS':
          return this.connectionData.connectionProperties.accessTokenUrl &&
            this.connectionData.connectionProperties.clientId &&
            this.connectionData.connectionProperties.clientSecret &&
            this.connectionData.connectionProperties.scope &&
            this.connectionData.connectionProperties.headerField &&
            (this.connectionData.connectionProperties.headerPrefix === '' || this.connectionData.connectionProperties.headerPrefix);
        default:
          return false;
      }
    }
    return false;
  }

  hasQueryParams(basicPath): boolean {
    const params = basicPath.toString().split('?');
    return params.length > 1;
  }

  saveOauthConnection(data: any) {
    if (data.connectionProperties.grantType === 'AUTHORIZATION_CODE') {
      this.saveOauthAuthCodeConnection(data);
    } else if (data.connectionProperties.grantType === 'PASSWORD' || data.connectionProperties.grantType === 'CLIENT_CREDENTIALS') {
      this.saveConnection();
    }
  }

  saveOauthAuthCodeConnection(data: any) {
    const zero = 0;
    const waitTime = 100;
    const basicPath = data.connectionProperties;
    basicPath.redirectUrl = window.location.origin;
    const paramString = this.hasQueryParams(basicPath.authUrl) ? '&' : '?';
    const targetUrl = `${basicPath.authUrl}${paramString}client_id=${basicPath.clientId}` +
      `&response_type=${basicPath.responseType}&scope=${encodeURIComponent(basicPath.scope)}&` +
      `state=${basicPath.state}&redirect_uri=${encodeURIComponent(basicPath.redirectUrl)}`;
    let code: string;
    let interval: any;
    let result = false;
    const self = this;
    if (basicPath.grantType === 'AUTHORIZATION_CODE') {
      const newWindow = window.open(targetUrl, 'popup', 'width=700,height=450,left=100,top=50');
      setTimeout(() => {
        interval = setInterval(() => {
          if (newWindow && newWindow.location && newWindow.location.href) {
            const url = new URL(newWindow.location.href);
            code = url.searchParams.get('code');
            if (code) {
              newWindow.close();
              basicPath.codeValue = code;
              self.saveOAuth(data, 'save');
              // if (message === 'saved') {
              //   result = self.saveOAuth(data, message);
              // } else {
              //   result = self.updateOAuth(data, message);
              // }
              clearInterval(interval);
            }
          }
        }, waitTime);
      }, zero);
    } else {
      self.saveOAuth(data, 'save');
    }
  }

  private saveOAuth(data: any, message: string) {
    let result = false;
    this.saveConnection();
  }

  clearConnectionProperties() {
    if (this.restConnection) {
      if (this.restConnection ?.headerArr) {
        this.restConnection.headerArr = [{ headerKey: '', headerValue: '' }];
      }
      if (this.restConnection ?.queryParam) {
        this.restConnection.queryParam = [{ headerKey: '', headerValue: '' }];
      }
    }
    this.connectionData.connectionProperties = {
      httpHeaders: {},
      queryParams: {},
      headerField: '',
    };
    this.connectionData.connectionProperties = {};
    this.enableBtnSave = false;
  }
}
