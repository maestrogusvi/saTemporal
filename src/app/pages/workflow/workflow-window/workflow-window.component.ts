import { Component, Output, EventEmitter, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';

import { jsPlumb } from 'jsplumb';
import { MdePopoverTrigger } from '@material-extended/mde';

import { ScheduleService } from './../../schedule/schedule.service';
// import * as jsPlumb from 'jsplumb';

import html2canvas from 'html2canvas';

import { WorkflowConstant } from '../workflow-constant.providers';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { INode, IWorkflow, IErrorJson, IErrorTask, IWorkflowDetails, IWorkflowPayload } from '../workflow.interface';
import { WorkflowWindowService } from './workflow-window.service';
import { UtilsService } from '../../shared/utils.service';
import { MetaConnectionComponent } from '../meta-connection/meta-connection.component';
import { WorkflowService } from '../workflow.service';
import { NotifierService } from 'angular-notifier';

// import * as jsPlumb from '@jsplumb/community';
import { MappingService } from '../../mapping/mapping.service';
import { MessageService } from '../../shared/services/message.service';
import { Subscription } from 'rxjs';
import { WorkflowProp } from '../workflows';


declare var $: any;
@Component({
  selector: 'sapper-workflow-window',
  templateUrl: './workflow-window.component.html',
  styleUrls: ['./workflow-window.component.scss'],
})
export class WorkflowWindowComponent implements OnInit {

  @Output() isWorkflowGet = new EventEmitter<any>();
  @Output() getDropData = new EventEmitter<any>();
  @Output() addNodeActive = new EventEmitter<string>();
  @Output() getWorkflowData = new EventEmitter<any>();
  @Input() workflowData;
  @Input() currentWorkflow;
  @ViewChild(MdePopoverTrigger) trigger: MdePopoverTrigger;

  activeWorkflow: any;
  workflowWindowList = [];
  testConnectionAction: boolean;
  tooltipDisabled = false;
  nodeName: string;
  savedPreview;
  dragedData = [];
  workflowDetails: IWorkflowDetails = {
    name: '',
    description: '',
    template: 'workflow-prop'
  };
  dragdataObj = {};
  counter = 0;
  groupCounter = 0;
  eventClone;
  jsPlumbInstance;
  // jsPlumbInstance = jsPlumb.getInstance();
  nodeDataClone;
  errorJsonData;
  errorJson: IErrorJson;
  showAction: boolean;
  workflowId;
  stepCounter = 0;
  private bpmnJson: IWorkflowPayload = new WorkflowProp({
    workflowId: this.workflowId,
    name: this.workflowDetails.name,
    description: this.workflowDetails.description,
    isExecutable: 'true'
  }).workflowProp;

  workflow: IWorkflow = {
    name: '',
    description: '',
    numPartitions: 5,
    reportTopic: 'Topic',
    tasks: {}
  };
  metaData = null;
  currentLabel: any;
  possitionLabel = {
    x: 0,
    y: 0
  };
  labelValue = '';
  public selectedItem;
  private nodeToAdd: any;

  public sliderOptions = {
    autoTicks: false,
    disabled: false,
    invert: false,
    max: 200,
    min: 100,
    showTicks: false,
    step: 10,
    thumbLabel: true,
    value: 100,
    vertical: true,
    tickInterval: 10,
  };
  selectedFile: any;
  message: any;
  mappingDetails = {};
  private readonly notifier: NotifierService;

  startNode = {
    id: 'start_node_' + this.route.snapshot.params.id,
    name: 'Start',
    description: 'Starting Node',
    logoPath: 'assets/images/start_node.png',
    bpmnType: 'startEvent',
    type: 'startNode'
  };

  endNode = {
    id: 'end_node_' + this.route.snapshot.params.id,
    name: 'End',
    description: 'Ending Node',
    logoPath: 'assets/images/end_node.png',
    bpmnType: 'endEvent',
    type: 'endNode'
  };

  private fileNameEditorVal;
  fileNameOptions;
  subscription: Subscription;


  constructor(
    public workflowConstant: WorkflowConstant,
    public dialog: MatDialog,
    private workflowWindowService: WorkflowWindowService,
    private router: Router,
    private route: ActivatedRoute,
    private utilService: UtilsService,
    public workflowService: WorkflowService,
    notifierService: NotifierService,
    private mappingService: MappingService,
    readonly messageService: MessageService,
    public scheduleService: ScheduleService
  ) {
    this.fileNameOptions = this.utilService.createFroalaOptions(this.fileNameEditorVal);
    this.notifier = notifierService;
    this.workflowConstant.getMessage().subscribe((message) => {
      if (message.text === 'deleteCon' && message.connection) {
        if (this.mappingDetails[message.connection.sourceId].target.length ||
          this.mappingDetails[message.connection.targetId].source.length) {
          this.jsPlumbInstance.deleteConnection(message.connection);
          // if delete connection update allNodeDetaila variable
          const indexTarget = this.mappingDetails[message.connection.sourceId].target.indexOf(message.connection.targetId, 0);
          const indexSource = this.mappingDetails[message.connection.targetId].source.indexOf(message.connection.sourceId, 0);
          if (indexTarget > -1) {
            this.mappingDetails[message.connection.sourceId].target.splice(indexTarget, 1);
          }
          if (indexSource > -1) {
            this.mappingDetails[message.connection.targetId].source.splice(indexSource, 1);
          }
        }
      }
      if (message.text === 'showLabel' && message.connection && message.connection.label && message.connection.pos) {
        this.trigger.closePopover();
        this.currentLabel = message.connection.label;
        this.possitionLabel = {
          x: message.connection.pos.clientX,
          y: message.connection.pos.clientY
        };
        this.labelValue = this.currentLabel.getLabel();
        setTimeout(() => {
          this.trigger.openPopover();
        }, 100);
      }
    });
    this.subscription = this.messageService.getMessage.subscribe((message) => {
      if (message && message.toLowerCase() === 'properties saved') {
        this.saveWorkflow();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.jsPlumbInstance = jsPlumb.getInstance();
    this.jsPlumbInstance.bind('connection', (connection) => {

      let sourceElementType, targetElementType, sourcebpmnType, targetbpmnType;
      if (this.mappingDetails[connection.sourceId] === undefined) {
        this.mappingDetails[connection.sourceId] = {
          source: [],
          target: []
        };
      }
      if (this.mappingDetails[connection.targetId] === undefined) {
        this.mappingDetails[connection.targetId] = {
          source: [],
          target: []
        };
      }
      this.dragedData.forEach((element, index) => {
        if (connection.sourceId === element.id) {
          sourceElementType = element.sapper_prop.sappertasktype;
          sourcebpmnType = element.sapper_prop.bpmnType;
        }
        if (connection.targetId === element.id) {
          targetElementType = element.sapper_prop.sappertasktype;
          targetbpmnType = element.sapper_prop.bpmnType;
        }
      });
      if (this.mappingDetails[connection.sourceId].target.indexOf(connection.targetId) === -1) {
        this.mappingDetails[connection.sourceId].target.push(connection.targetId);
      }
      if (this.mappingDetails[connection.targetId].source.indexOf(connection.sourceId) === -1) {
        this.mappingDetails[connection.targetId].source.push(connection.sourceId);
      }
    });
    this.jsPlumbInstance.bind('group:collapse', (p) => { });

    this.jsPlumbInstance.bind('group:addMember', (p) => {
      if (this.dragdataObj[p.group.id]) {
        if (!this.dragdataObj[p.group.id].child) {
          this.dragdataObj[p.group.id].child = {};
        }
        if (this.dragdataObj[p.el.id]) {
          this.dragdataObj[p.group.id].child[p.el.id] = this.dragdataObj[p.el.id];
          delete this.dragdataObj[p.el.id];

          this.dragdataObj[p.group.id].child[p.el.id].sapper_prop.top = parseInt(this.jsPlumbInstance.getElement(p.el.id).style.top.slice(0, -2));
          this.dragdataObj[p.group.id].child[p.el.id].sapper_prop.left = parseInt(this.jsPlumbInstance.getElement(p.el.id).style.left.slice(0, -2));
          this.dragdataObj[p.group.id].child[p.el.id].sapper_prop.step = 'Step-' + this.calculateStepCounter(this.dragdataObj[p.group.id].child[p.el.id].sapper_prop.sappertasktype);
        }
      }
    });
    this.jsPlumbInstance.bind('group:removeMember', (p) => {
      // self.jsPlumbInstance.deleteConnectionsForElement(p.el);
    });
    this.workflowId = this.route.snapshot.params.id;
    this.initializeWorkflowById(this.workflowId);
    if (this.workflowId) {
      this.workflowWindowService.workflowUpdated = true;
    }
  }

  /**
   * Used to initialize each workflow
   * @param string workflowId
   * @returns void
   */
  initializeWorkflowById(workflowId): void {
    this.jsPlumbInstance.deleteEveryConnection();
    this.jsPlumbInstance.deleteEveryEndpoint();
    this.workflowId = workflowId;
    if (this.workflowData) {
      this.workflowDetails.name = this.workflowData.name;
      this.workflowDetails.description = this.workflowData.description;
    } else {
      this.workflowWindowService.getWorkflowById(this.workflowId).subscribe((data) => {
        this.workflow = this.utilService.fetchResponseData(data);
        this.workflowDetails.name = data.data.process.processProp.name;
        this.workflowDetails.description = data.data.process.processProp.documentation;
        this.paintWorkflow(data.data);
        this.isWorkflowGet.emit(workflowId);
      });
    }
    this.workflowProperties();
  }
  /**
   * Used to reset workflow before initializing new workflow
   * @returns void
   */
  resetWorkflow(): void {
    this.jsPlumbInstance.deleteEveryConnection();
    this.jsPlumbInstance.deleteEveryEndpoint();
    this.dragedData = [];
    this.dragdataObj = {};
    this.workflowId = '';
    this.workflowData = '';
    this.workflowDetails = {
      name: '',
      description: '',
      template: 'workflow-prop'
    };
    this.workflow = {
      name: '',
      description: '',
      numPartitions: 5,
      reportTopic: 'Topic',
      tasks: {}
    };
  }

  adjustZoom(event) {
    const transformAmt = event.value / 100;
    document.getElementById(
      'drop-zone'
    ).style.transform = `scale(${transformAmt})`;
  }

  /**
   * @param tabname opens tab which passes to function and toggle between tabs
   * @returns void
   */
  drop(event): void {
    this.testConnectionAction = false;
    this.eventClone = JSON.parse(JSON.stringify(event));
    this.eventClone.mouseEvent = event.mouseEvent;
    const nodeData = this.addNodeInDraggedData(
      this.eventClone.dragData,
      this.eventClone
    );
    this.onNodeClicked(nodeData, false);
  }

  /**
   * to add node in dragged data
   * @param eventCloneData: INode
   * @param eventClone: any
   * @returns INode
   */
  addNodeInDraggedData(eventCloneData, eventClone?: any) {
    this.counter++;
    let nodeId;
    const timeStamp = Date.now();
    if (eventCloneData.mainType === 'TRIGGER') {
      nodeId = `${this.workflowId}_TRIGGER`;
    } else {
      nodeId = `node_${this.counter}_${eventCloneData.name}_${timeStamp}`;
    }
    nodeId = nodeId.replace(/\s/g, '');
    let nodeData = {
      id: nodeId,
      name: eventCloneData.name,
      label: eventCloneData.name,
      description: eventCloneData.description,
      // type: eventCloneData.type,
      connectionId: '',
      propertiesId: '',
      metaId: '',
      sapper_prop: {
        sappertasktype: eventCloneData.type,
        bpmnType: eventCloneData.bpmnType,
        connectionType: eventCloneData.connectionType,
        top: eventClone.mouseEvent ? eventClone.mouseEvent.offsetY : eventCloneData.top,
        taskCategory: 'APPLICATION',
        logoPath: eventCloneData.logoPath ? eventCloneData.logoPath : eventCloneData.imageUrl,
        left: eventClone.mouseEvent ? eventClone.mouseEvent.offsetX - 20 : eventCloneData.left + 170,
        step: 'Step-' + this.calculateStepCounter(eventCloneData.type)
      }
    };
    if (eventCloneData.type) {
      nodeData = this.manageFieldsOnNodeType(nodeData, eventCloneData.type);
    }
    this.dragedData.push(nodeData);
    this.dragdataObj[nodeData.id] = nodeData;
    this.mappingDetails[nodeData.id] = {
      source: [],
      target: []
    };
    setTimeout(() => {
      eventCloneData.mouseEvent = eventClone.mouseEvent;
      this.addEndPointsToDroppedNode(nodeId, eventCloneData);
    });
    return nodeData;
  }

  calculateStepCounter(type) {
    if (type !== 'startNode' && type !== 'endNode') {
      this.stepCounter++;
    }
    // if (type === 'subProcess') {
    //   this.stepCounter--;
    //   return '0';
    // }
    return this.stepCounter;
  }

  /**
   * Used to modify node json depends on node type
   * @param  any node
   * @param  string type
   * @returns any
   */
  private manageFieldsOnNodeType(node, type): any {
    if (type.toLowerCase() === 'transformation') {
      node['sourceMetaId'] = '';
      node['mappingId'] = '';
    }
    return node;
  }

  /**
   * to get the properties of node
   * @param item: any
   * @param event: any
   * @returns void
   */
  onNodeClicked(item: INode, event: any): void {
    this.getDropData.emit(item);
    this.selectedItem = item.id;
    if (event) {
      event.stopPropagation();
    }
  }

  autoArrange() {
    let top = 0;
    let left = 0;
    this.dragedData.forEach((element) => {
      if (element.data.isStart) {
        top = top + 300;
        element.top = top;
        left = left + 50;
        element.left = left;
      }
    });
    setTimeout(() => {
      this.jsPlumbInstance.repaintEverything();
    }, 50);
  }

  /**
   * To add endpoints to the left and right side of the node
   * @param id: string
   * @returns void
   */
  private addEndPointsToDroppedNode(id: string, data?: any | undefined): void {
    if (data && (data.type === 'branch' || data.sappertasktype === 'branch')) {
      this.workflowConstant.leftEndpoint.maxConnections = 1;
      this.workflowConstant.rightEndpoint.maxConnections = -1;
    }
    if (data && (data.type === 'joint' || data.sappertasktype === 'joint')) {
      this.workflowConstant.leftEndpoint.maxConnections = -1;
      this.workflowConstant.rightEndpoint.maxConnections = 2;
    }
    if (data && (data.type === 'conditional' || data.sappertasktype === 'conditional')) {
      this.jsPlumbInstance.addEndpoint(
        id,
        this.workflowConstant.anchorPositionRight,
        this.workflowConstant.conditionEndpoint()
      );
    }
    if (data && (data.type === 'conditional-branch' || data.sappertasktype === 'conditional-branching')) {
      this.jsPlumbInstance.addEndpoint(
        id,
        this.workflowConstant.anchorPositionRight,
        this.workflowConstant.conditionEndpoint()
      );
    }
    if (data && data.type !== 'endNode' && data.sappertasktype !== 'endNode' && data.type !== 'conditional' && data.sappertasktype !== 'conditional' && data.type !== 'conditional-branch' && data.sappertasktype !== 'conditional-branching') {
      this.jsPlumbInstance.addEndpoint(
        id,
        this.workflowConstant.anchorPositionRight,
        this.workflowConstant.rightEndpoint
      );
    }
    if (data && data.type !== 'startNode' && data.sappertasktype !== 'startNode') {
      this.jsPlumbInstance.addEndpoint(
        id,
        this.workflowConstant.anchorPositionLeft,
        this.workflowConstant.leftEndpoint
      );
    }

    this.jsPlumbInstance.draggable(id, {
      stop: (params) => {
        if (this.dragdataObj[id]) {
          this.dragdataObj[id].sapper_prop.top = params.pos[1];
          this.dragdataObj[id].sapper_prop.left = params.pos[0];
        } else {
          const groupId = this.jsPlumbInstance.getGroupFor(id).id;
          this.dragdataObj[groupId].child[id].sapper_prop.top = params.pos[1];
          this.dragdataObj[groupId].child[id].sapper_prop.left = params.pos[0];
        }
      },
      filter: '.ui-resizable-handle'
    });
    if (data && data.type === 'subProcess') {
      setTimeout(() => {
        this.jsPlumbInstance.addGroup({
          el: document.getElementById(id),
          id,
          orphan: true,
          prune: true
        });
        const startNode = {
          id: 'startNode' + Date.now(),
          name: 'start',
          label: 'start',
          description: 'start node',
          // type: eventCloneData.type,
          connectionId: '',
          propertiesId: '',
          metaId: '',
          sapper_prop: {
            sappertasktype: this.startNode.type,
            bpmnType: this.startNode.bpmnType,
            connectionType: '',
            top: data.mouseEvent.offsetY + 20,
            taskCategory: 'APPLICATION',
            logoPath: this.startNode.logoPath,
            left: data.mouseEvent.offsetX + 20,
            step: 'Step-0'
          }
        };
        const endNode = {
          id: 'endNode' + Date.now(),
          name: 'end',
          label: 'end',
          description: 'end node',
          // type: eventCloneData.type,
          connectionId: '',
          propertiesId: '',
          metaId: '',
          sapper_prop: {
            sappertasktype: this.endNode.type,
            bpmnType: this.endNode.bpmnType,
            connectionType: '',
            top: data.mouseEvent.offsetY + 150,
            taskCategory: 'APPLICATION',
            logoPath: this.endNode.logoPath,
            left: data.mouseEvent.offsetX + 350,
            step: 'Step-0'
          }
        };
        this.dragedData.push(startNode);
        this.dragedData.push(endNode);
        setTimeout(() => {
          this.addEndPointsToDroppedNode(startNode.id, { type: 'startNode' });
          this.addEndPointsToDroppedNode(endNode.id, { type: 'endNode' });
          setTimeout(() => {
            this.jsPlumbInstance.addToGroup(id, document.getElementById(startNode.id));
            this.jsPlumbInstance.addToGroup(id, document.getElementById(endNode.id));
            this.dragdataObj[id].child = {};
            this.dragdataObj[id].child[startNode.id] = startNode;
            this.dragdataObj[id].child[startNode.id].sapper_prop.top = 20;
            this.dragdataObj[id].child[startNode.id].sapper_prop.left = 40;
            this.dragdataObj[id].child[endNode.id] = endNode;
            this.dragdataObj[id].child[endNode.id].sapper_prop.top = 150;
            this.dragdataObj[id].child[endNode.id].sapper_prop.left = 370;
          });
        });
        $('#' + id).resizable({
          stop: () => {
            const ele = this.jsPlumbInstance.getElement(id);
            this.repaintWorkflow();
            this.dragdataObj[id].sapper_prop.height = parseInt(ele.style.height.slice(0, -2), 10);
            this.dragdataObj[id].sapper_prop.width = parseInt(ele.style.width.slice(0, -2), 10);
          },
          handles: 'all'
        }, 0, this);
      }, 100, this);
    }
  }


  /**
   * to repaint everything
   * @returns void
   */
  private repaintWorkflow(): void {
    this.jsPlumbInstance.repaintEverything();
  }

  /**
   * Removes node reference from all the system
   */
  private removeNodeRef(nodeObject: INode, index: number) {
    this.dragedData.splice(index, 1);
    if (this.dragdataObj[nodeObject.id]) {
      delete this.dragdataObj[nodeObject.id];
    } else {
      const groupId = this.jsPlumbInstance.getGroupFor(nodeObject.id);
      if (groupId) {
        delete this.dragdataObj[groupId.id].child[nodeObject.id];
      }
    }
    this.jsPlumbInstance.removeAllEndpoints(nodeObject.id);
    this.jsPlumbInstance.remove(nodeObject.id);
    this.repaintWorkflow();
  }

  /**
   * To delete node
   * @param nodeObject: INode
   * @returns void
   */
  deleteNode(nodeObject: INode): void {
    this.dragedData.forEach((node, index) => {
      if (node.id === nodeObject.id) {
        if (node.sapper_prop.sappertasktype.toLowerCase() === 'transformation' && node.mappingId) {
          this.mappingService.deleteMapping(node.mappingId).subscribe((data) => {
            this.utilService.showSuccess('Mappings are deleted successfully!!', '');
            this.removeNodeRef(nodeObject, index);
          });
        } else if (node.sapper_prop.sappertasktype.toLowerCase() === 'schedule-trigger') {
          this.scheduleService.deleteScheduleByWorkflowId(this.workflowId).subscribe((schedule) => {
            this.utilService.showSuccess('Scheduler deleted successfully!!', '');
            this.removeNodeRef(nodeObject, index);
          });
        } else {
          this.removeNodeRef(nodeObject, index);
        }
      }
    });
  }

  compress(item, event) {
    this.jsPlumbInstance.collapseGroup(item.id);
  }

  /**
   * create a duplicate node
   * @param nodeObject: any
   * @returns void
   */
  copyNode(node: any): void {
    const nodeObject = JSON.parse(JSON.stringify(node));
    this.addNodeInDraggedData(nodeObject, ' ');
  }

  /**
   * Checks if node exists in
   * the system or deleted.
   * @nodeId: string
   */
  private checkIfNodeExists(nodeId) {
    if (this.dragdataObj[nodeId]) {
      return true;
    } else if (this.jsPlumbInstance.getGroupFor(nodeId)) {
      return true;
    }
    return false;
  }

  /**
   * to create request data of workflow save
   * @returns IWorkflow
   */
  private createWorkflowData(dragDataObj, bpmnJson) {
    // tslint:disable-next-line:forin
    for (const key in dragDataObj) {
      if (dragDataObj.hasOwnProperty(key)) {
        const data = dragDataObj[key];
        if (bpmnJson[data.sapper_prop.bpmnType] && bpmnJson[data.sapper_prop.bpmnType].length > 0) {
          if (data.sapper_prop.bpmnType === 'endEvent' || data.sapper_prop.bpmnType === 'startEvent') {
            bpmnJson[data.sapper_prop.bpmnType] = data;
          } else if (data.sapper_prop.bpmnType === 'subProcess') {
            const subprocess = {
              subProcessProp: {
                id: data.id,
                name: 'SubProcessForEach',
                data,
                multiInstanceLoopCharacteristics: {
                  isSequential: 'true',
                  elementVariable: data.id,
                  inputDataItem: data.subProcessInputDataItem
                }
              }
            };
            bpmnJson[data.sapper_prop.bpmnType].push(this.createWorkflowData(data.child, subprocess));
          } else {
            bpmnJson[data.sapper_prop.bpmnType].push(data);
          }
        } else {
          if (data.sapper_prop.bpmnType === 'endEvent' || data.sapper_prop.bpmnType === 'startEvent') {
            bpmnJson[data.sapper_prop.bpmnType] = data;
          } else if (data.sapper_prop.bpmnType === 'subProcess') {
            const subprocess = {
              subProcessProp: {
                id: data.id,
                name: 'SubProcessForEach',
                data,
                multiInstanceLoopCharacteristics: {
                  isSequential: 'true',
                  elementVariable: data.id,
                  inputDataItem: data.subProcessInputDataItem
                }
              }
            };
            bpmnJson[data.sapper_prop.bpmnType] = [this.createWorkflowData(data.child, subprocess)];
          } else {
            bpmnJson[data.sapper_prop.bpmnType] = [data];
          }
        }
        const connections = this.mappingDetails[data.id];
        if (connections && connections.target && connections.target.length > 0) {
          connections.target.forEach((targetId) => {
            if (this.checkIfNodeExists(targetId) && this.checkIfNodeExists(data.id)) {
              if (!bpmnJson.sequenceFlow) {
                bpmnJson.sequenceFlow = [];
              }
              const constData: any = {
                id: 'sequence_' + targetId + '_' + data.id,
                sourceRef: data.id,
                targetRef: targetId
              };
              const conn = this.jsPlumbInstance.getConnections({ source: data.id, target: targetId });
              if (conn && conn.length === 1 && conn[0].getOverlay('equation') &&
                conn[0].getOverlay('equation').getLabel() && conn[0].getOverlay('equation').getLabel().length > 0) {
                constData.conditionExpression = this.utilService.conditionalSlotToTemp(conn[0].getOverlay('equation').getLabel());
              }
              // if (connection.getOverlay('equation') && connection.getOverlay('equation').getLabel()
              //   && connection.getOverlay('equation').getLabel().length > 0) {
              //   data.conditionExpression = connection.getOverlay('equation').getLabel();
              // }
              bpmnJson.sequenceFlow.push(constData);
            }
          });
        }
      }
      this.testConnectionAction = false;
    }
    return bpmnJson;
  }



  /**
   * save the workflow
   * @returns void
   */
  saveWorkflow(): void {
    this.bpmnJson = new WorkflowProp({
      workflowId: this.workflowId,
      name: this.workflowDetails.name,
      description: this.workflowDetails.description,
      isExecutable: 'true'
    }).workflowProp;
    this.bpmnJson.process = this.createWorkflowData(this.dragdataObj, this.bpmnJson.process);
    // for screenshot
    // this.captureScreenShot();
    setTimeout(() => {
      // this.updateWorkflowForSoapConnection(this.bpmnJson);
      this.workflowWindowService.updateWorkflow(this.bpmnJson).subscribe((data) => {
        this.workflowWindowService.workflowUpdated = true;
        this.utilService.showSuccess('Workflow updated successfully!!', '');
      });
    }, 1000);

  }

  /**
   * To delete the workflow
   * @returns void
   */
  deleteWorkflow(): void {
    const message =
      ' Are you sure you want to delete this automation?';
    const dialogData = new ConfirmDialogModel(
      'Delete Automation Confirmation',
      message,
      true
    );
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.workflowWindowService.deleteWorkflow(this.workflowId).subscribe(data => {
          this.utilService.showSuccess('Automation is deleted.', '');
          this.router.navigateByUrl('/automation');
        });
      }
    });
  }

  // /**
  //  * to capture workflow's screenshot
  //  * @returns void
  //  */
  // private captureScreenShot(): void {
  //   html2canvas(document.querySelector('#drop-zone')).then((canvas) => {
  //     const contentData = canvas.toDataURL('image/png');
  //     this.savedPreview = contentData;
  //   });
  // }


  /**
   * to paint the workflow using json file
   * @param jsonData: any
   * @returns void
   */
  public paintWorkflow(jsonData): void {
    let tasks;
    if (!Array.isArray(jsonData)) {
      tasks = Object.values(jsonData);
    } else {
      tasks = jsonData;
    }
    tasks.forEach((task: any) => {
      if (task.startEvent) {
        this.dragedData.push(task.startEvent);
        this.dragdataObj[task.startEvent.id] = task.startEvent;
        setTimeout(() => {
          this.addEndPointsToDroppedNode(task.startEvent.id, task.startEvent.sapper_prop);
        });
      } else {
        this.startNode.id = 'startNode_' + this.workflowId;
        this.addNodeInDraggedData(
          this.startNode,
          { mouseEvent: { offsetY: 250, offsetX: 30 } }
        );
      }
      if (task.endEvent) {
        this.dragedData.push(task.endEvent);
        this.dragdataObj[task.endEvent.id] = task.endEvent;
        setTimeout(() => {
          this.addEndPointsToDroppedNode(task.endEvent.id, task.endEvent.sapper_prop);
        });
      } else {
        this.endNode.id = 'endNode_' + this.workflowId;
        this.addNodeInDraggedData(
          this.endNode,
          { mouseEvent: { offsetY: 250, offsetX: 1000 } }
        );
      }
      if (task.serviceTask) {
        task.serviceTask.forEach((element: any) => {
          this.dragedData.push(element);
          this.dragdataObj[element.id] = element;
          setTimeout(() => {
            this.addEndPointsToDroppedNode(element.id, element.sapper_prop);
          });
        });
      }
      if (task.inclusiveGateway) {
        task.inclusiveGateway.forEach((element: any) => {
          this.dragedData.push(element);
          this.dragdataObj[element.id] = element;
          setTimeout(() => {
            this.addEndPointsToDroppedNode(element.id, element.sapper_prop);
          });
        });
      }
      if (task.exclusiveGateway) {
        task.exclusiveGateway.forEach((element: any) => {
          this.dragedData.push(element);
          this.dragdataObj[element.id] = element;
          setTimeout(() => {
            this.addEndPointsToDroppedNode(element.id, element.sapper_prop);
          });
        });
      }
      if (task.sequenceFlow) {
        this.paintSequenceFlow(task.sequenceFlow);
      }
      if (task.subProcess) {
        this.paintSubProcess(task.subProcess);
      }
    });
  }

  private paintSubProcess(subProcessData) {
    let top;
    let left;
    let groupId;
    subProcessData.forEach((task: any) => {
      if (task.subProcessProp) {
        top = task.subProcessProp.data.sapper_prop.top;
        left = task.subProcessProp.data.sapper_prop.left;
        groupId = task.subProcessProp.data.id;
        this.dragdataObj[task.subProcessProp.data.id] = task.subProcessProp.data;
        this.dragdataObj[task.subProcessProp.data.id].child = {};
        this.paintNode(task.subProcessProp.data);
        setTimeout(() => {
          this.jsPlumbInstance.addGroup({
            el: document.getElementById(task.subProcessProp.data.id),
            id: task.subProcessProp.data.id,
            orphan: true,
            prune: true
          });
          $('#' + task.subProcessProp.data.id).resizable({
            stop: () => {
              const ele = this.jsPlumbInstance.getElement(task.subProcessProp.data.id);
              this.repaintWorkflow();
              this.dragdataObj[task.subProcessProp.data.id].sapper_prop.height = parseInt(ele.style.height.slice(0, -2), 10);
              this.dragdataObj[task.subProcessProp.data.id].sapper_prop.width = parseInt(ele.style.width.slice(0, -2), 10);
            },
            handles: 'all'
          });
        }, 0, this);
      }
      if (task.startEvent) {
        this.addMemberInGroup(groupId, task.startEvent, top, left);
      }
      if (task.endEvent) {
        this.addMemberInGroup(groupId, task.endEvent, top, left);
      }
      if (task.serviceTask) {
        task.serviceTask.forEach((element: any) => {
          this.addMemberInGroup(groupId, element, top, left);
        });
      }
      if (task.inclusiveGateway) {
        task.inclusiveGateway.forEach((element: any) => {
          this.addMemberInGroup(groupId, element, top, left);
        });
      }
      if (task.exclusiveGateway) {
        task.exclusiveGateway.forEach((element: any) => {
          this.addMemberInGroup(groupId, element, top, left);
        });
      }
      if (task.sequenceFlow) {
        this.paintSequenceFlow(task.sequenceFlow);
      }
    });
  }

  /**
   * To add task into the subprocess
   * @param groupId: string
   * @param element: any
   * @param top: number
   * @param left: number
   */
  private addMemberInGroup(groupId, element, top, left) {
    element.sapper_prop.top = element.sapper_prop.top + top;
    element.sapper_prop.left = element.sapper_prop.left + left;
    setTimeout(() => {
      this.jsPlumbInstance.addToGroup(groupId, document.getElementById(element.id));
      const task = this.jsPlumbInstance.getElement(element.id);
      this.dragdataObj[groupId].child[element.id].sapper_prop.top = parseInt(task.style.top.slice(0, -2), 10);
      this.dragdataObj[groupId].child[element.id].sapper_prop.left = parseInt(task.style.left.slice(0, -2), 10);
    });
    this.dragdataObj[groupId].child[element.id] = element;
    this.paintNode(element);
  }

  /**
   * To paint the sequence flow
   * @param sequenceFlow: any
   */
  private paintSequenceFlow(sequenceFlow) {
    sequenceFlow.forEach((node) => {
      this.mappingDetails[node.sourceRef] = {
        source: [],
        target: []
      };
      setTimeout(() => {
        let overlay = this.workflowConstant.rightEndpoint.connectorOverlays;
        if (node.conditionExpression && node.conditionExpression.length > 0) {
          node.conditionExpression = this.utilService.conditionalTempToSlot(node.conditionExpression, this.dragdataObj);
          overlay = this.workflowConstant.conditionEndpoint(node.conditionExpression).connectorOverlays;
        }
        this.jsPlumbInstance.connect({
          source: node.sourceRef,
          target: node.targetRef,
          connector: this.workflowConstant.connectorType,
          anchors: ['RightMiddle', 'LeftMiddle'],
          overlays: overlay,
          endpoint: [
            'Dot',
            { radius: 5, cssClass: 'string', hoverClass: 'string' },
          ],
        }, this.workflowConstant.connectionParams);
        this.repaintWorkflow();
      }, 100);
    });
  }

  /**
   * To paint the task
   * @param node: any
   */
  private paintNode(node) {
    this.dragedData.push(node);
    setTimeout(() => {
      this.addEndPointsToDroppedNode(node.id, node.sapper_prop);
    });
  }
  /**
   * To delete whole workflow
   * @returns void
   */
  clearCanvas(): void {
    const dataClone = [...this.dragedData];
    dataClone.forEach((node) => {
      this.deleteNode(node);
    });
    this.workflowProperties();
  }

  /**
   * to add node
   * @param node: any
   * @returns: void
   */
  addNode(node): void {
    this.nodeToAdd = node;
    this.addNodeActive.emit();
  }

  /**
   * To connect selected nodes from left panel
   * @param nodeObject: any
   * @returns: void
   */
  addNodeToActive(nodeObject): void {
    const node = {
      top: this.nodeToAdd.top,
      left: this.nodeToAdd.left,
      data: nodeObject,
    };
    this.copyNode(node);
    setTimeout(() => {
      this.jsPlumbInstance.connect({
        source: this.nodeToAdd.id,
        target: `node_${this.counter}_${node.data.name}`,
        connector: this.workflowConstant.connectorType,
        anchors: ['RightMiddle', 'LeftMiddle'],
        overlays: this.workflowConstant.rightEndpoint.connectorOverlays,
        endpoint: [
          'Dot',
          { radius: 5, cssClass: 'string', hoverClass: 'string' },
        ],
      });
      this.repaintWorkflow();
    }, 100);
  }

  /**
   * for workflow properties in right panel
   * @returns void
   */
  workflowProperties(): void {
    this.getDropData.emit(this.workflowDetails);
  }
  /*
  * open meta dialog for preview
  */
  openMetaUplaod(draggedData) {
    const metaId = draggedData.metaId;
    this.workflowService.getMeta(metaId).subscribe((response) => {
      this.metaData = JSON.parse(response.data.meta);
      this.dialog.open(MetaConnectionComponent, { data: { isApplicationMeta: true, data: this.metaData } });
    });
  }
  /* to get the selected node error object
  * @param item: any
  */
  nodeStatus(item): IErrorTask {
    return this.errorJson.tasks.find(e => e.id === item.id);
  }

  /**
   * to test the connection
   * @returns void
   */
  testWorkflow(): void {
    this.workflowWindowService.testWorkflow(this.workflowId).subscribe(data => { });
    this.testConnectionAction = true;
    // this.executeWorkflow();
    this.errorJson = {
      name: 'Test Automation',
      description: 'Test Automation description',
      tasks: [
        {
          id: 'node_6_Greenhouse',
          name: 'Greenhouse',
          status: 'SUCCESS',
          message: 'SUCCESS message',
        },
        {
          id: 'node_7_Workday ',
          name: 'Workday',
          status: 'FAILED',
          message: 'Username or Password is incorrect.',
        },
        {
          id: 'node_8_Cornerstone OnDemand',
          name: 'Cornerstone OnDemand',
          status: 'FAILED',
          message: 'The connection is not active.',
        },
        {
          id: 'node_9_Slack',
          name: 'Slack',
          status: 'SUCCESS',
          message: 'SUCCESS message',
        },
      ],
    };
  }

  /**
   * to shoe the message dialog
   * @param item: any
   */
  showMessageDialog(item): void {
    const node = this.nodeStatus(item);
    const dialogData = new ConfirmDialogModel(
      `Test Connection: ${node.name}`,
      node.message,
      false
    );
    this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      panelClass: 'error-dialog',
      data: dialogData,
    });
  }

  /**
   * Used to manually execute the workflows
   */
  executeWorkflow(): void {
    this.workflowWindowService.executeWorkflow(this.workflowId).subscribe(data => {
      this.utilService.showSuccess('Automation executed successfully!!', '');
    });
  }

  onResizeEnd(event) { }

  saveCondition() {
    this.currentLabel.setLabel(this.labelValue);
    this.trigger.closePopover();
  }
  /**
   * Used to export the workflows/automations
   */
  downloadWorkflowJson() {
    this.workflowWindowService.exportWorkflow(this.workflowId).subscribe(response => {
      this.utilService.downLoadFile(response, 'application/json', `${this.workflowId}.json`);
    });

  }

}
