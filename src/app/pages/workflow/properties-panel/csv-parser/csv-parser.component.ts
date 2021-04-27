import { Component, OnInit, Input } from '@angular/core';
import { IDefaultProperties } from '../../workflow.interface';
import { UtilsService } from '../../../shared/utils.service';
import { FormControl } from '@angular/forms';
import { ICsvParser } from '../properties.interface';
import { WorkflowService } from '../../workflow.service';

@Component({
  selector: 'sapper-csv-parser',
  templateUrl: './csv-parser.component.html',
  styleUrls: ['./csv-parser.component.scss']
})
export class CsvParserComponent implements OnInit {
  @Input() droppedNode;
  @Input() dragDataObj;

  selectedOption: IDefaultProperties = {
    value: '',
    label: ''
  };

  csvParserInputTypeOptions: IDefaultProperties[] = [
    { value: 'FILENAME', label: 'Using file name' },
    { value: 'CSVSTRING', label: 'Csv Input' }
  ];

  fileNameOptions;

  taskProperties: ICsvParser;

  @Input() set taskDetails(taskDetails) {
    if (taskDetails) {
      this.taskProperties = taskDetails;
      if (taskDetails.csvParserInputType === 'FILENAME') {
        this.selectedOption = this.csvParserInputTypeOptions[0];
      } else {
        this.selectedOption = this.csvParserInputTypeOptions[1];
      }
      if (this.taskProperties.csvData) {
        this.fileNameOptions = this.utilsService.createFroalaOptions('', this.taskProperties.csvData);
      }
    } else {
      this.selectedOption = {
        value: '',
        label: ''
      };
    }
  }

  selectedFiles = [];

  constructor(
    private utilsService: UtilsService,
    private workflowService: WorkflowService) {
    this.fileNameOptions = this.utilsService.createFroalaOptions('');
  }

  ngOnInit(): void {
    this.workflowService.propertySave.subscribe((data) => {
      if (this.droppedNode.sapper_prop.sappertasktype === data) {
        if (this.taskProperties.csvData.includes('<span')) {
          this.taskProperties.csvData = this.utilsService.convertSlotToTemp(this.taskProperties.csvData);
        }
      }
    });
  }

  setCsvParserInputType(event, task) {
    // this.csvParserInputType = event.value;
    this.taskProperties.csvParserInputType = event.value.value;
  }

}
