import { Component, Input, OnInit } from '@angular/core';
import { UtilsService } from '../../../shared/utils.service';
import { WorkflowService } from '../../workflow.service';
import { ICollectorProperties } from '../properties.interface';

@Component({
  selector: 'sapper-collector',
  templateUrl: './collector.component.html',
  styleUrls: ['./collector.component.scss']
})
export class CollectorComponent implements OnInit {

  @Input() droppedNode;
  @Input() dragDataObj;
  @Input() set taskDetails(taskDetails) {
    if (taskDetails) {
      this.taskProperties = taskDetails;
      if (this.taskProperties.collectorInput) {
        this.collectorOptions = this.utilsService.createFroalaOptions('', this.taskProperties.collectorInput);
      }
    }
  }

  taskProperties: ICollectorProperties;
  collectorOptions;

  constructor(
    private utilsService: UtilsService,
    private workflowService: WorkflowService) {
    this.collectorOptions = this.utilsService.createFroalaOptions('');
  }

  ngOnInit(): void {
    this.workflowService.propertySave.subscribe((data) => {
      if (this.droppedNode.sapper_prop.sappertasktype === data) {
        if (this.taskProperties.collectorInput.includes('<span')) {
          this.taskProperties.collectorInput = this.utilsService.convertSlotToTemp(this.taskProperties.collectorInput);
        }
      }
    });
  }

}
