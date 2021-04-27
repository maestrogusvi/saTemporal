import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UtilsService } from '../../../shared/utils.service';
import 'froala-editor/js/plugins.pkgd.min.js';
import { WorkflowService } from '../../workflow.service';
import { TransformationProperties } from './../properties';

@Component({
  selector: 'sapper-transformation',
  templateUrl: './transformation.component.html',
  styleUrls: ['./transformation.component.scss']
})
export class TransformationComponent implements OnInit {

  contentTypes = ['JSON'];
  connectionList: any[];
  taskProperties: TransformationProperties = {
    sourceMeta: {
      type: 'SLOT',
      value: '',
      id: ''
    },
    targetMeta: {
      type: 'SLOT',
      value: '',
      id: ''
    }
  };
  sourceObjectOptions;
  targetObjectOptions;

  @Output() isShowMapping = new EventEmitter<any>();
  @Output() isSourceDataDeleted = new EventEmitter<any>();
  @Input() droppedNode;
  @Input() dragDataObj;
  @Input() set taskDetails(taskDetails) {
    if (taskDetails) {
      this.taskProperties.targetMeta.value = '';
      setTimeout(() => {
        this.taskProperties = taskDetails;
        this.sourceObjectOptions = this.utilsService.createFroalaOptions('', this.taskProperties.sourceMeta.value);
        if (this.taskProperties.targetMeta && this.taskProperties.targetMeta.type === 'SLOT') {
          this.targetObjectOptions = this.utilsService.createFroalaOptions('', this.taskProperties.targetMeta.value);
        }
        if (this.taskProperties.targetMeta && this.taskProperties.targetMeta.type === 'FILE') {
          this.taskProperties.targetMeta.value['_fileNames'] = this.taskProperties.targetMeta.value;
        }
      }, 100);
    }
  }

  constructor(private utilsService: UtilsService, private workflowService: WorkflowService) {
    this.sourceObjectOptions = this.utilsService.createFroalaOptions();
    this.targetObjectOptions = this.utilsService.createFroalaOptions();
  }

  ngOnInit() {
    this.workflowService.propertySave.subscribe((data) => {
      if (this.taskProperties.sourceMeta.value.includes('<span')) {
        this.taskProperties.sourceMeta.value = this.utilsService.convertSlotToTemp(this.taskProperties.sourceMeta.value);
      }
      if (this.taskProperties.targetMeta.value.includes('<span')) {
        this.taskProperties.targetMeta.value = this.utilsService.convertSlotToTemp(this.taskProperties.targetMeta.value);
      }
    });
  }

}
