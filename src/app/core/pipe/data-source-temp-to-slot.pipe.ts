import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from 'src/app/pages/shared/utils.service';

@Pipe({
  name: 'dataSourceTempToSlot'
})
export class DataSourceTempToSlotPipe implements PipeTransform {

  constructor(private utilsService: UtilsService) {}

  transform(value: string, dragDataObj) {
    return this.utilsService.dataSourceTempToSlot(value, dragDataObj);
  }

}
