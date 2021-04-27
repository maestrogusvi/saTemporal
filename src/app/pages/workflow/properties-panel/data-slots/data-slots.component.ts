import { Component, OnInit, Input } from '@angular/core';
import { WorkflowService } from '../../workflow.service';
import { UtilsService } from 'src/app/pages/shared/utils.service';
import { jsPlumb } from 'jsplumb';

@Component({
  selector: 'sapper-data-slots',
  templateUrl: './data-slots.component.html',
  styleUrls: ['./data-slots.component.scss']
})
export class DataSlotsComponent implements OnInit {
  @Input() droppedNode;
  @Input() mappingDetails;
  @Input() parentData;
  @Input() dragdataObj;

  dataSlots = [];
  dataSlotsSet = new Set();
  options = {
    allowDrag: true,
    allowDrop: false,
    actionMapping: {
      mouse: {
        dragStart: (tree, node, $event) => {
          $event.dataTransfer.setData('json-path', $event.currentTarget.querySelector('span.node-label').getAttribute('json-path'));
          $event.dataTransfer.setData('json-step', $event.currentTarget.querySelector('span.node-label').getAttribute('json-step'));
          $event.dataTransfer.setData('task-id', $event.currentTarget.querySelector('span.node-label').getAttribute('task-id'));
          $event.dataTransfer.setData('slot-type', $event.currentTarget.querySelector('span.node-label').getAttribute('slot-type'));
          $event.stopPropagation();
        }
      }
    }
  };
  panelOpenState = false;
  jsPlumbInstance;
  constructor(private workflowService: WorkflowService,
    private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.jsPlumbInstance = jsPlumb.getInstance();
    const sourceId = this.getSourceId(this.droppedNode.id);
    console.log(sourceId);
    this.getMetaHistory(sourceId);
  }

  getSourceId(id) {
    return this.mappingDetails[id].source;
  }

  getMetaHistory(sourceFields) {
    let parentData = this.parentData ? this.parentData : this.dragdataObj;
    if (sourceFields.length) {
      sourceFields.forEach(sourceId => {
        if (parentData[sourceId].sapper_prop.collectorObject) {
          Object.values(parentData[sourceId].sapper_prop.collectorObject).forEach(collector => {
            this.dataSlotsSet.add(collector);
          });
        }
        if (!this.parentData) {
          if (parentData[sourceId] && parentData[sourceId].metaId) {
            this.dataSlotsSet.add(parentData[sourceId]);
          }
        }
        if (this.parentData) {
          if (parentData[sourceId].sapper_prop.bpmnType === 'startEvent') {
            const groupId = this.jsPlumbInstance.getGroupFor(sourceId);
            if (groupId && this.dragdataObj[groupId.id].metaId) {
              this.dataSlotsSet.add(this.dragdataObj[groupId.id]);
            }
          } else {
            if (parentData[sourceId].metaId) {
              this.dataSlotsSet.add(this.parentData[sourceId]);
            }
          }
        }
        const id = this.getSourceId(sourceId);
        this.getMetaHistory(id);
      });
    }
    this.dataSlots = Array.from(this.dataSlotsSet);
  }

  /**
   * To get meta by metaId
   * @param metaId: string
   */
  getMetaByMetaId(dataSlot, index) {
    this.panelOpenState = true;
    this.workflowService.getMeta(dataSlot.metaId).subscribe((response) => {
      this.dataSlots[index]['jsonMeta'] = JSON.parse(response.data.meta);
      if (!Array.isArray(JSON.parse(response.data.meta))) {
        this.dataSlots[index]['jsonMeta'] = this.utilsService.updateTreeViewData(JSON.parse(response.data.meta));
      }
    });
  }

  onDragStart(event) {
    event.dataTransfer.setData('json-path', event.currentTarget.getAttribute('json-path'));
    event.dataTransfer.setData('json-step', event.currentTarget.getAttribute('json-step'));
    event.dataTransfer.setData('task-id', event.currentTarget.getAttribute('task-id'));
    event.dataTransfer.setData('slot-type', event.currentTarget.getAttribute('slot-type'));
  }

  /**
   * Used to create node path from root
   * @param  ITreeNodes node
   * @returns string
   */
  getParent(node): string {
    const lineage = [];
    const pathArr = [];
    let path = '';
    if (node.data.type && node.data.type === 'array') {
      if (!node.data.name.endsWith('[0]')) {
        node.data.pathname = node.data.name + '[0]';
      }
    } else {
      node.data.pathname = node.data.name;
    }
    // add clicked node as first item
    lineage.push(node.data);
    // grab parent of clicked node
    let parent = node.parent;
    // loop through parents until the root of the tree is reached
    while (parent !== null) {
      if (parent.data.name) {
        if (parent.data.type && parent.data.type === 'array') {
          if (!parent.data.name.endsWith('[0]')) {
            parent.data.pathname = parent.data.name + '[0]';
          }
        } else {
          parent.data.pathname = parent.data.name;
        }
      }
      lineage.push(parent.data);
      parent = parent.parent;
    }
    lineage.pop();
    lineage.reverse().forEach(item => {
      pathArr.push(item.pathname);
    });
    path = `${pathArr.join('.')}`;
    if (path.endsWith('[0]')) {
      path = path.slice(0, -3);
    }
    return path;
  }

}
