import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from 'src/app/pages/shared/utils.service';
import { IDefaultProperties } from '../../workflow.interface';
import { WorkflowService } from '../../workflow.service';
import { ICsvConverter } from '../properties.interface';

@Component({
  selector: 'sapper-csv-converter',
  templateUrl: './csv-converter.component.html',
  styleUrls: ['./csv-converter.component.scss']
})
export class CsvConverterComponent implements OnInit {

  @Input() droppedNode;
  @Input() dragDataObj;

  selectedOption: IDefaultProperties = {
    value: '',
    label: ''
  };
  dataSlotOptions;
  taskProperties: ICsvConverter;

  csvConverterInputTypeOptions: IDefaultProperties[] = [
    { value: 'DATASLOT', label: 'Using Data Slot' },
  ];

  @Input() set taskDetails(taskDetails) {
    if (taskDetails) {
      this.taskProperties = taskDetails;
      if (taskDetails.inputType === 'DATASLOT') {
        this.selectedOption = this.csvConverterInputTypeOptions[0];
      }
      if (this.taskProperties.data) {
        this.dataSlotOptions = this.utilsService.createFroalaOptions('', this.taskProperties.data);
      }
    } else {
      this.selectedOption = {
        value: '',
        label: ''
      };
    }
  }

  constructor(
    private utilsService: UtilsService,
    private workflowService: WorkflowService) {
    this.dataSlotOptions = this.utilsService.createFroalaOptions('');
  }

  ngOnInit(): void {
    this.workflowService.propertySave.subscribe((data) => {
      if (this.droppedNode.sapper_prop.sappertasktype === data) {
        if (this.taskProperties.data.includes('<span')) {
          this.taskProperties.data = this.utilsService.convertSlotToTemp(this.taskProperties.data);
        }
      }
    });
  }

  setCsvConverterInputType(event, task) {
    this.taskProperties.inputType = event.value.value;
  }


}
