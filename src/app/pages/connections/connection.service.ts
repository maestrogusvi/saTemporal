import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UtilsService } from './../shared/utils.service';
import { IConnections } from './connections.interface';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(private utilsService: UtilsService, private httpClient: HttpClient) { }

  testConnection(connectionData) {
    if (connectionData.type === 'S3') {
      return this.utilsService.returnPostCall(`/test-connection/s3`, connectionData);
    } else if (connectionData.type === 'FTP') {
      return this.utilsService.returnPostCall(`/test-connection/ftp`, connectionData);

    } else if (connectionData.type === 'SOAP') {
      return this.utilsService.returnPostCall(`/test-connection/soap`, connectionData);

    } else if (connectionData.type === 'SFTP') {
      return this.utilsService.returnPostCall(`/test-connection/sftp`, connectionData);
    } else if (connectionData.type === 'REST_TOKEN') {
      return this.utilsService.returnPostCall(`/test-connection/rest/token`, connectionData);

    } else if (connectionData.type === 'REST_BASIC') {
      return this.utilsService.returnPostCall(`/test-connection/rest/basic`, connectionData);
    } else if (connectionData.type === 'REST_API_KEY') {
      return this.utilsService.returnPostCall(`/test-connection/rest/api-key`, connectionData);
    } else if (connectionData.type === 'REST_OAUTH2' && connectionData.connectionProperties.grantType === 'AUTHORIZATION_CODE') {
      return this.utilsService.returnPostCall(`/test-connection/rest/oauth/authorization-code`, connectionData);
    } else if (connectionData.type === 'REST_OAUTH2' && connectionData.connectionProperties.grantType === 'PASSWORD') {
      return this.utilsService.returnPostCall(`/test-connection/rest/oauth/password-credentials`, connectionData);
    } else if (connectionData.type === 'SQL') {
      return this.utilsService.returnPostCall(`/test-connection/sql`, connectionData);
    } else {
      return this.utilsService.returnPostCall(`/test-connection/rest/oauth/client-credentials`, connectionData);
    }
  }

  /**
   * To get connection listing
   */
  getConnectionListing() {
    return this.utilsService.returnGetCall(`/connection/all`);
  }

  /**
   * To save the connections
   * @param connectionObject: IConnections
   */
  saveConnection(connectionObject: IConnections) {
    let responseObject;
    switch (connectionObject.type) {
      case 'S3':
        responseObject = this.setMethodForSaveData(`/connection/s3`, connectionObject);
        break;

      case 'FTP':
        responseObject = this.setMethodForSaveData(`/connection/ftp`, connectionObject);
        break;

      case 'SFTP':
        responseObject = this.setMethodForSaveData(`/connection/sftp`, connectionObject);
        break;

      case 'REST_TOKEN':
        responseObject = this.setMethodForSaveData(`/connection/rest/token`, connectionObject);
        break;

      case 'REST_BASIC':
        responseObject = this.setMethodForSaveData(`/connection/rest/basic`, connectionObject);
        break;

      case 'REST_API_KEY':
        responseObject = this.setMethodForSaveData(`/connection/rest/api-key`, connectionObject);
        break;
      case 'REST_OAUTH2':
        switch (connectionObject.connectionProperties.grantType) {
          case 'AUTHORIZATION_CODE':
            responseObject = this.setMethodForSaveData(`/connection/rest/oauth2/authorization-code`, connectionObject);
            break;
          case 'PASSWORD':
            responseObject = this.setMethodForSaveData(`/connection/rest/oauth2/password-credentials`, connectionObject);
            break;
          case 'CLIENT_CREDENTIALS':
            responseObject = this.setMethodForSaveData(`/connection/rest/oauth2/client-credentials`, connectionObject);
            break;
          default:
            break;
        }
        break;

      case 'SQL':
        responseObject = this.setMethodForSaveData('connection/sql', connectionObject);
        break;

      case 'SOAP':
        responseObject = this.setMethodForSaveData('connection/soap', connectionObject);
        break;

      default:
        break;
    }
    return responseObject;
  }

  private setMethodForSaveData(url, connectionObject) {
    // return connectionObject.id ?
    // this.utilsService.returnPutCall(url, connectionObject) :
    // this.utilsService.returnPostCall(url, connectionObject);
    return this.utilsService.returnPostCall(url, connectionObject);
  }

  /**
   * To delete connection
   * @param id: string
   */
  deleteConnection(id: string) {
    return this.utilsService.returnDeleteCall(`/connection/${id}`);
  }

  getConnectionListingByType(connectionType) {
    return this.utilsService.returnGetCall(`connection/connections/${connectionType}`);
  }

  getConnectionListingById(connectionId) {
    return this.utilsService.returnGetCall(`connection/${connectionId}`);
  }

  getFile(id: string) {
    return this.utilsService.returnGetCall(`multi-media/file/${id}`);
  }

  onEditFileUpload(id, file) {
    return this.utilsService.returnPutCall(`multi-media/file/${id}`, file);
  }

  fileUploadSoap(file) {
    return this.utilsService.returnPostCall(`multi-media/file`, file);
  }
}
