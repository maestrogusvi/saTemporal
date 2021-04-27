import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UtilsService } from './../../utils.service';


@Injectable({
  providedIn: 'root'
})
export class KeyPropertiesService {

  constructor(private utilsService: UtilsService, private httpClient: HttpClient) { }

  getAdditionalProperties(tasktype) {
    return this.utilsService.returnGetCall(`/additionalProperties/${tasktype}`);
  }

  postAdditionalProperties(additionalPropertyObj) {
    return this.utilsService.returnPostCall(`/additionalProperties`, additionalPropertyObj);
  }
}
