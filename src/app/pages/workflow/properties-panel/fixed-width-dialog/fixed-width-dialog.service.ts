import { Injectable } from '@angular/core';
import { UtilsService } from '../../../shared/utils.service';

@Injectable({
  providedIn: 'root'
})
export class FixedWidthDialogService {

  constructor(
    private utilsService: UtilsService
  ) { }

  saveFixedWidthMeta(fixedWidthMeta): any {
     return this.utilsService.returnPostCall(`/meta/fixedWidth`, fixedWidthMeta);
  }

  updateFixedWidthMeta(fixedWidthMeta, metaId): any {
    return this.utilsService.returnPutCall(`/meta/fixedWidth/${metaId}`, fixedWidthMeta);
  }
}
