import { Injectable } from '@angular/core';
import { UtilsService } from '../../../shared/utils.service';
import { IwsdlProperties } from '../../workflow.interface';

@Injectable({
  providedIn: 'root'
})
export class SoapService {

  constructor(private utilsService: UtilsService) { }

  /**
   * to get soap wsdl operations list
   * @param connectionId: string
   * @param directoryPath: string
   */
  getWsdlOperations(wsdlURL): any {
    return this.utilsService.returnGetCall(`/soap/getOperation?wsdlURL=${wsdlURL}`);
  }

  getMeta(objectName, applicationName): any {
    return this.utilsService.returnGetCall(`/soap/meta?objectName=${objectName}&applicationName=${applicationName}`);
  }

  getWsdlByApplicationName(applicationName): any {
    return this.utilsService.returnGetCall(`/soap/wsdl/${applicationName}`);
  }

  updateMeta(objectName, applicationName, metaId): any {
    return this.utilsService.returnPutCall(`/soap/meta?objectName=${objectName}&applicationName=${applicationName}&metaId=${metaId}`, {});
  }
  disableTenantSchedule(tenantId) {
    return this.utilsService.returnPutCall(`/scheduler/pause-tenant/${tenantId}`, {});
  }
  getApplication(): any {
    return this.utilsService.returnGetCall(`/soap/applications`);
  }

  getResponse(RequestBody): any {
    return this.utilsService.returnPostCall(`/soap/getRequestMessageByOperation`, RequestBody);
  }
}
