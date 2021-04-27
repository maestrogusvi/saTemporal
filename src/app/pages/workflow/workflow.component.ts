import { Component, ViewChild, ViewChildren, QueryList, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotkeysService, Hotkey, ExtendedKeyboardEvent } from 'angular2-hotkeys';

import { jsPlumb } from 'jsplumb';

import { triggerData, coreData, helperData } from './../../../assets/common.variable';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { PropertiesPanelComponent } from './properties-panel/properties-panel.component';
import { WorkflowWindowComponent } from './workflow-window/workflow-window.component';
import { MatDialog } from '@angular/material/dialog';
import { MappingComponent } from '../mapping/mapping.component';
import { ScheduleComponent } from '../schedule/schedule.component';
import { Schedule } from '../schedule/schedule.interface';
import { ScheduleService } from '../schedule/schedule.service';
import { UtilsService } from '../shared/utils.service';
import { IApplicationNode } from '../app-store/app-store.interface';
import { AppStoreService } from '../app-store/app-store.service';
import { MessageService } from '../shared/services/message.service';
import { INode } from './workflow.interface';

@Component({
  selector: 'sapper-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit {

  @ViewChild(LeftSidebarComponent) leftSidebar: LeftSidebarComponent;
  @ViewChildren(PropertiesPanelComponent) propertiesPanels: QueryList<PropertiesPanelComponent>;
  @ViewChildren(WorkflowWindowComponent) workflowWindows: QueryList<WorkflowWindowComponent>;

  public appData: IApplicationNode[];
  public triggerData = triggerData;
  public coreData = coreData;
  public helperData = helperData;
  public schedule: Schedule;
  workflowData;
  workflowWindowList = [];
  currentWorkflow;
  workflowWindow: any;
  propertiesPanel: any;
  propertiesData;
  node: INode;
  isSaveProperties;
  jsPlumbInstance;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    readonly messageSevice: MessageService,
    public scheduleService: ScheduleService,
    private utilService: UtilsService,
    private hotkeysService: HotkeysService,
    private appStoreService: AppStoreService) {

    const hotKeysArray = [{ shortcut: 'alt+p', event: 'properties' },
    { shortcut: 'alt+a', event: 'app' },
    { shortcut: 'alt+c', event: 'core' },
    { shortcut: 'alt+t', event: 'trigger' },
    { shortcut: 'alt+h', event: 'helper' }];
    hotKeysArray.forEach(key => {
      this.hotkeysService.add(
        new Hotkey(key.shortcut, (event: KeyboardEvent): ExtendedKeyboardEvent => {
          return this.keyboardEvent(event, key.event);
        })
      );
    });
    this.getApplicationList();
  }

  ngOnInit(): void {
    this.jsPlumbInstance = jsPlumb.getInstance();
  }

  setActiveWorkflow(currentWorkflow): void {
    if (currentWorkflow) {
      this.currentWorkflow = currentWorkflow;
      if (this.workflowWindowList.findIndex(item => item.id === currentWorkflow.id) === -1) {
        this.workflowWindowList.push(currentWorkflow);
      }
      this.router.navigateByUrl(`/automation/edit/${currentWorkflow.id}`);
      setTimeout(() => {
        this.workflowWindow = this.workflowWindows.toArray().find(item => item.workflowId === currentWorkflow.id);
      });
    }
  }

  closeClickedWorkflow(workflowId): void {
    const index = this.workflowWindowList.findIndex(item => item.id === workflowId);
    this.workflowWindowList.splice(index, 1);
  }

  /**
   * To get all applications
   */
  private getApplicationList() {
    this.appStoreService.getAllApplications().subscribe(data => {
      this.appData = data.data;
    });
  }

  private keyboardEvent(event, tab) {
    const e: ExtendedKeyboardEvent = event;
    e.returnValue = false;
    if (tab !== '') {
      this.propertiesPanel.openCloseTab(tab);
    }
    return e;
  }

  /**
   * Used to get saved schedule data
   * @returns void
   */
  getSchedule(workflowId): void {
    setTimeout(() => {
      this.propertiesPanel = this.propertiesPanels.toArray().find(item => item.workflow.process.processProp.id === this.currentWorkflow.id);
    });
    if (this.workflowWindow) {
      setTimeout(() => {
        this.propertiesPanel = this.propertiesPanels.toArray().find(item => item.workflow.process.processProp.id === this.currentWorkflow.id);
      });
      if (workflowId) {
        this.scheduleService.getScheduleByWorkflowId(workflowId).subscribe((schedule) => {
          this.schedule = this.utilService.fetchResponseData(schedule);
        });
      }
    }
  }

  /**
   * Used to open schedule dialog
   * @returns void
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(ScheduleComponent, {
      data: { name: 'Schedule', workflowId: this.currentWorkflow.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.schedule = result;
    });
  }

  /**
   * Used to open mapping dialog
   * @returns void
   */
  openMappingDialog(node): void {
    const workflow = JSON.parse(this.currentWorkflow.jsonDefinition);
    const dialogRef = this.dialog.open(MappingComponent, {
      panelClass: 'mapping-dialog',
      data: {
        name: 'Mapping',
        workflowId: this.currentWorkflow.id,
        sourceMetaIds: [node.sourceMetaId],
        targetMetaIds: [node.metaId],
        mappingId: this.getMappingId(node)
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.workflowWindow.dragdataObj[node.id]) {
          this.workflowWindow.dragdataObj[node.id].mappingId = result;
        } else {
          const groupId = this.jsPlumbInstance.getGroupFor(node.id);
          if (groupId) {
            this.workflowWindow.dragdataObj[groupId.id].child[node.id].mappingId = result;
          }
        }
      }
    });
  }

  getNode(node: INode): void {
    this.node = node;
    if (node && node.name) {
      switch (node.name.toLowerCase()) {
        case 'scheduled':
          this.openDialog();
          break;
        default:
          this.setDataToGetNodeDetails(node);
      }
    }
  }

  /**
   * Used to set default metaIds for transformation
   * @param  {any} node
   * @returns void
   */
  private setDefaultMetaIdsForTransformation(node: INode): void {
    const sourceMetaId = this.getSourceMetaIds(node).meta[0];
    if (!node.sourceMetaId || this.isArrayContainUnusedValue(node.sourceMetaId)) {
      if (node.sourceMetaId) {
        delete this.node.sourceMetaId;
        delete this.workflowWindow.dragdataObj[node.id].sourceMetaId;
      }
      this.node['sourceMetaId'] = sourceMetaId;
      this.workflowWindow.dragdataObj[node.id]['sourceMetaId'] = sourceMetaId;
    }
    if (!this.node.metaId || this.isArrayContainUnusedValue(node.metaId)) {
      const targetMetaId = this.getTargetMetaId(node, sourceMetaId);
      this.node.metaId = targetMetaId;
      this.workflowWindow.dragdataObj[node.id].metaId = targetMetaId;
    }
  }

  setTransformationMetaIds(metaId): void {
    this.node.metaId = metaId;
    this.workflowWindow.dragdataObj[this.node.id].metaId = metaId;
  }

  setTransformationSource(node): void {
    delete node.sourceMetaId;
    const sourceMetaId = this.getSourceMetaIds(node).meta[0];
    this.node.sourceMetaId = sourceMetaId;
    this.workflowWindow.dragdataObj[this.node.id].sourceMetaId = sourceMetaId;
  }

  private setDataToGetNodeDetails(node) {
    const groupId = this.jsPlumbInstance.getGroupFor(node.id);
    if (groupId && node.sapper_prop.bpmnType !== 'subProcess') {
      this.propertiesPanel.getNodeDetails(node, this.workflowWindow.dragdataObj[groupId.id].child);
    } else {
      this.propertiesPanel.getNodeDetails(node);
    }
  }

  showMapping(node): void {
    const sourceIds = this.workflowWindow.mappingDetails[node.id].source;
    if (sourceIds.length > 0 && this.getSourceMetaIds(node).meta && this.getSourceMetaIds(node).meta[0] !== '') {
      this.openMappingDialog(node);
    } else {
      const msg = sourceIds.length === 0 ?
        'Please connect atleast one source with uploaded meta.' : 'Please upload source meta for previous node';
      this.utilService.showError(msg, '');
    }
  }

  /**
   * @param  {any} node
   * @param  {string} sourceMetaId
   * @returns any
   */
  private getTargetMetaId(node: any, sourceMetaId: string): any {
    if (!node.metaId || this.isArrayContainUnusedValue(node.metaId)) {
      this.workflowWindow.dragdataObj[node.id].metaId = sourceMetaId;
      return sourceMetaId;
    }
    return node.metaId;
  }

  /**
   * Used to get source meta ids for mapper
   * @param any node
   * @returns Array
   */
  getSourceMetaIds(node): any {
    let metaIds = [];
    const sourceNodeIds = [];
    const workflow = JSON.parse(this.currentWorkflow.jsonDefinition);
    if (node && this.workflowWindow.mappingDetails[node.id]) {
      const sourceIds = this.workflowWindow.mappingDetails[node.id].source;
      sourceIds.forEach(sourceItem => {
        let metaId = '';
        if (this.workflowWindow.dragdataObj[sourceItem]) {
          metaId = this.workflowWindow.dragdataObj[sourceItem].metaId;
        } else {
          const groupId = this.jsPlumbInstance.getGroupFor(sourceItem);
          if (groupId) {
            metaId = this.workflowWindow.dragdataObj[groupId.id].child[sourceItem].metaId;
          }
        }
        metaIds.push(metaId);
      });
      if (sourceIds) { sourceNodeIds.push(sourceIds[0]); }
      if (sourceNodeIds.length === 0 && metaIds.length === 0 && workflow.process.sequenceFlow) {
        let source = workflow.process.sequenceFlow.filter(item => item.targetRef === node.id);
        if (source.length > 0) {
          source = source[0].sourceRef;
          sourceNodeIds.push(source);
          const metaId = workflow.process.serviceTask.filter(item => item.id === source)[0].metaId;
          if (metaId) { metaIds.push(metaId); }
        }
      }
      if (node.sourceMetaId && node.sourceMetaId.length > 0 && !this.isArrayContainUnusedValue(node.sourceMetaId)) {
        metaIds = [node.sourceMetaId];
      }
    }
    return { node: sourceNodeIds, meta: metaIds };
  }

  isArrayContainUnusedValue(array): boolean {
    return (Array.isArray(array) && array.includes('')) || array.includes(undefined) || array.includes(null) || array.length === 0;
  }

  /**
   * Used to get target meta ids for mapper
   * @param any node
   * @returns Array
   */
  getTargetMetaIds(node): any {
    const metaIds = [];
    const targetNodeIds = [];
    const workflow = JSON.parse(this.currentWorkflow.jsonDefinition);
    if (node) {
      const targetIds = this.workflowWindow.mappingDetails[node.id].target;
      targetIds.forEach(targetItem => {
        let metaId = '';
        if (this.workflowWindow.dragdataObj[targetItem]) {
          metaId = this.workflowWindow.dragdataObj[targetItem].metaId;
        } else {
          const groupId = this.jsPlumbInstance.getGroupFor(targetItem);
          if (groupId) {
            metaId = this.workflowWindow.dragdataObj[groupId.id].child[targetItem].metaId;
          }
        }
        metaIds.push(metaId);
      });
      if (targetIds) { targetNodeIds.push(targetIds[0]); }
      if (targetNodeIds.length === 0 && metaIds.length === 0 && workflow.process.sequenceFlow) {
        let target = workflow.process.sequenceFlow.filter(item => item.sourceRef === node.id);
        if (target.length > 0) {
          target = target[0].targetRef;
          targetNodeIds.push(target);
          const metaId = workflow.process.serviceTask.filter(item => item.id === target)[0].metaId;
          if (metaId) { metaIds.push(metaId); }
        }
      }
      return { node: targetNodeIds, meta: metaIds };
    }
  }

  getMappingId(node): string {
    if (this.workflowWindow.dragdataObj[node.id]) {
      return this.workflowWindow.dragdataObj[node.id].mappingId;
    } else {
      const groupId = this.jsPlumbInstance.getGroupFor(node.id);
      if (groupId) {
        return this.workflowWindow.dragdataObj[groupId.id].child[node.id].mappingId;
      }
    }
    return null;
  }
}
