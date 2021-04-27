import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UtilsService } from '../shared/utils.service';
import { IMarketGroup } from './market-group.interface';
import {API} from '../../constants/api';

@Injectable({
  providedIn: 'root'
})
export class MarketGroupService {

  constructor(private utilsService: UtilsService, private httpClient: HttpClient) { }

  testConnection(connectionData) {
  }

  /**
   * To get connection listing
   */
  getConnectionListing() {
    return this.utilsService.returnGetCall(API.SERVER + API.API + API.MARKETGROUPS);
  }

  postMarketGroup(marketGroup: IMarketGroup) {
    return this.utilsService.returnPostCall(API.SERVER + API.API + API.MARKETGROUPS, marketGroup);
  }

  putMarketGroup(marketGroup: IMarketGroup) {
    return this.utilsService.returnPutCall(API.SERVER + API.API + API.MARKETGROUPS, marketGroup);
  }

  /**
   * To save the connections
   * @param connectionObject: IConnections
   */
  saveConnection(connectionObject: IMarketGroup) {
  }

  private setMethodForSaveData(url, connectionObject) {
    // return connectionObject.id ?
    // this.utilsService.returnPutCall(url, connectionObject) :
    // this.utilsService.returnPostCall(url, connectionObject);
    return this.utilsService.returnPostCall(url, connectionObject);
  }

   GetOrgTypeListing() {
    return this.utilsService.returnGetCall(API.SERVER + API.API + API.ORGTYPE);
  }

  GetBrandsListing() {
    return this.utilsService.returnGetCall(API.SERVER + API.API + API.BRANDS);
  }

  getMarketsByMg(mkId: any) {
    return this.utilsService.returnGetCall(API.SERVER + API.API + API.MARKET + mkId);
  }
}
