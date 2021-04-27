import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from 'src/app/pages/shared/utils.service';

@Pipe({
  name: 'templateToSlot'
})
export class TemplateToSlotPipe implements PipeTransform {

  constructor(private utilsService: UtilsService) {}

  transform(value: string, dragDataObj) {
    return this.utilsService.templateToSlot(value, dragDataObj);
  }

}
