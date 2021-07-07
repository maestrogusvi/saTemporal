import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import { UtilsService } from '../shared/utils.service';
import { IOrganization } from './organizations.interface';
import {API} from '../../constants/api';

@Injectable({
  providedIn: 'root'
})
export class OrganizationsService {

  constructor(private utilsService: UtilsService, private httpClient: HttpClient) { }
  /**
   * To get connection listing
   */
  getOrganizationByMgListing(mgId: any, size, page) {
    let params = new HttpParams();
    params = params.append('size', size);
    params = params.append('page', page);
    return this.utilsService.returnGetCall(API.SERVER + API.API + API.ORGANIZATIONBYMG + mgId + '?' + params.toString() );
  }

  getOrganizations( size, page) {
    let params = new HttpParams();
    params = params.append('size', size);
    params = params.append('page', page);
    return this.utilsService.returnGetCall(API.SERVER + API.API + API.ORGANIZATION + '?' + params.toString());
  }


  getOrganizationsBySearch(url: string, size, page) {
    let params = new HttpParams();
    params = params.append('size', size);
    params = params.append('page', page);
    return this.utilsService.returnGetCall(API.SERVER + API.API + API.ORGANIZATIONANDSEARCH + url + '&' + params.toString());
  }

  putOrganizationActive(mgId: any, active) {
    const obj = {
      id: mgId,
      active
    };
    return this.utilsService.returnPutCall(API.SERVER + API.API + API.ORGANIZATIONACTIVE, obj);
  }

  /**
   * To save the connections
   * @param connectionObject: IConnections
   */
  saveConnection(connectionObject: IOrganization) {
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
