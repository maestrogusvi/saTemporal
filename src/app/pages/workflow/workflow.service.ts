import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../shared/utils.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  workflowMeta: any = [];
  propertySave = new Subject<string>();
  constructor(
    public router: Router,
    private utilsService: UtilsService,
    private httpClient: HttpClient) { }

  /**
   * execute workflow
   * @param any  scheduleObject
   */
  executeWorkflow(scheduleObject) {
    return this.utilsService.returnPostCall(`/scheduler/execute`, scheduleObject);
  }

  /*upload file to serer and get proper contract with meta
      */
  uploadFile(type, file) {
    // Get data from API
    return this.utilsService.returnPostCall(`/meta?fileType=${type}`, file);
  }

  saveMeta(meta) {
    return this.utilsService.returnPutCall(`/meta`, meta);
  }

  saveMetaWithoutFile(meta) {
    return this.utilsService.returnPostCall(`/metaData`, meta);
  }

  getMeta(metaId) {
    return this.utilsService.returnGetCall(`/meta/${metaId}`);
  }

  deleteMeta(metaId) {
    return this.utilsService.returnDeleteCall(`/meta/${metaId}`);
  }

  /**
   * To get meta for file
   */
  getFile() {
    return this.utilsService.returnGetCall(`/response/file`);
  }

  /**
   * To get meta for files
   */
  getFiles() {
    return this.utilsService.returnGetCall(`/response/files`);
  }

  getStandardMetaFormat(taskType, ioType, taskpropertiesId) {
    return this.utilsService.returnGetCall(`/std/meta/${taskType}/${ioType}/${taskpropertiesId}`)
  }

}
