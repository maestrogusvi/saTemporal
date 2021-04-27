import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FixedWidthDialogComponent } from '../fixed-width-dialog/fixed-width-dialog.component';
import { IDefaultProperties } from '../../workflow.interface';
import { UtilsService } from '../../../shared/utils.service';
import { WorkflowService } from '../../workflow.service';
import { IfixedWidthParser } from '../properties.interface';

@Component({
  selector: 'sapper-fixed-width-parser',
  templateUrl: './fixed-width-parser.component.html',
  styleUrls: ['./fixed-width-parser.component.scss']
})
export class FixedWidthParserComponent implements OnInit {
  @Input() dragDataObj;
  @Input() droppedNode;
  @Output() saveMetaFixedWidth = new EventEmitter();
  @Input() set taskDetails(taskDetails) {
    if (taskDetails) {
      this.taskProperties = taskDetails;
      if (taskDetails.parserOption === 'PARSE_FILE') {
        this.selectedOption = this.fixedWidthParserOptions[0];
      } else {
        this.selectedOption = this.fixedWidthParserOptions[1];
      }
      if (this.taskProperties.fileName) {
        this.fileNameOptions = this.utilsService.createFroalaOptions('', this.taskProperties.fileName);
      }
      if (this.taskProperties.parserOption) {
        this.parseStringOptions = this.utilsService.createFroalaOptions('', this.taskProperties.parserOption);
      }
    } else {
      this.selectedOption = {
        value: '',
        label: ''
      };
    }
  }

  selectedOption: IDefaultProperties = {
    value: '',
    label: ''
  };

  fixedWidthParserOptions: IDefaultProperties[] = [
    { value: 'PARSE_FILE', label: 'Using parse file' },
    { value: 'PARSE_STRING', label: 'Using parse string' }
  ];

  taskProperties: IfixedWidthParser;
  fileNameOptions;
  parseStringOptions;

  constructor(
    public dialog: MatDialog,
    private utilsService: UtilsService,
    private workflowService: WorkflowService

  ) {
    this.fileNameOptions = this.utilsService.createFroalaOptions();
    this.parseStringOptions = this.utilsService.createFroalaOptions();
  }

  ngOnInit(): void {
    this.workflowService.propertySave.subscribe((data) => {
      if (this.droppedNode.sapper_prop.sappertasktype === data) {
        if (this.taskProperties.fileName.includes('<span')) {
          this.taskProperties.fileName = this.utilsService.convertSlotToTemp(this.taskProperties.fileName);
        }
        if (this.taskProperties.parserOption.includes('<span')) {
          this.taskProperties.parserOption = this.utilsService.convertSlotToTemp(this.taskProperties.parserOption);
        }
      }
    });
  }

  /**
   * To open fixed width parser dialog
   */
  openFixedWidthParserModal() {
    if (this.droppedNode.metaId) {
      this.getMetaByMetaId(this.droppedNode.metaId);
    } else {
      this.openModal();
    }
  }

  openModal(fixedWidthMeta?) {
    const dialogRef = this.dialog.open(FixedWidthDialogComponent, {
      data: fixedWidthMeta,
      height: '400px',
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveMetaFixedWidth.emit(result);
      }
    });
  }

  getMetaByMetaId(metaId) {
    this.workflowService.getMeta(metaId).subscribe((response) => {
      this.openModal(response.data);
    });
  }

  setFixedWidthParserInputType(event) {
    this.taskProperties.parserOption = event.value.value;
  }
}
