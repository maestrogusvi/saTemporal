import { Component, OnInit, Input, ViewChild, TemplateRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatAccordion } from '@angular/material/expansion';

import { UtilsService } from '../../../../app/pages/shared/utils.service';
import { WorkflowService } from '../workflow.service';
import { ITreeNode } from '../workflow.interface';
import { TreeComponent } from '@circlon/angular-tree-component';

const type = 'string/number';
@Component({
  selector: 'sapper-meta-connection',
  templateUrl: './meta-connection.component.html',
  styleUrls: ['./meta-connection.component.scss']
})

export class MetaConnectionComponent implements OnInit {
  arrayType = type;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<MetaConnectionComponent>,
    @Inject(MAT_DIALOG_DATA) dialogData,
    private workflowService: WorkflowService,
    private utilsService: UtilsService
  ) {

    this.sourceMeta = this.utilsService.updateTreeViewData(dialogData.data);
    this.dataSource = this.sourceMeta;

  }

  @Input() internal: boolean;
  @ViewChild('metaConnection') metaConnection: TemplateRef<any>;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('metaTree') metaTree: TreeComponent;
  panelOpenState = false;
  formatList: string[];
  parent: any;
  inputMeta: any;
  currentField: any;
  currentInputMetaField: any;
  cordWizardService: any;
  mappingId: any;
  modalService: any;
  modalRef: any;
  treeControl = new NestedTreeControl<ITreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<ITreeNode>();
  sourceMeta: any = [];
  selectedObject: any;
  expandedAll = true;
  addingNewField = false;
  newField = { name: '', 'ui-label': '', type: 'string', children: [] };

  metaData: [];
  fileToUpload: File;
  filetype: string;

  saveMetaObject = {};

  hasChild = (_: number, node: ITreeNode) => !!node.children && node.children.length > 0;

  /**
   * call when click on tree node expand collapse button
   * @param node tree node for expansion
   */
  changeState(node) {
    node.expanded = !node.expanded;
  }

  /**
   * call when click on tree node label
   * @param node tree node for get current field
   */
  setMetaProperties(node) {
    this.currentField = node;
    node && !node.isObject ? this.dialogRef.updateSize('60%', '80%') : this.dialogRef.updateSize('40%', '80%');
  }


  ngOnInit(): void {
    this.setMetaProperties(null);
    this.formatList = ['default', 'date-time', 'email', 'url'];
  }

  onTypeChange(event, currentField) {
    const selectedType = event.value;
    const one = 1;
    if (selectedType === 'object') {
      currentField.children.push({
        name: '', children: [], 'ui-label': '', type: 'string', expanded: true,
        pattern: '',
        format: '',
        minLength: 0,
        maxLength: '',
        description: '',
        order: one
      });
    }
  }

  onArrayChange(currentField) {
    const one = 1;
    if (currentField.arraySubType === 'object') {
      if (currentField.children.length === 0) {
        currentField.children.push({
          name: '', children: [], 'ui-label': '', type: 'string', expanded: true,
          pattern: '',
          format: '',
          minLength: 0,
          maxLength: '',
          description: '',
          order: one
        });
      } else {
        this.arrayType = 'object';
      }
    }
  }

  validateMaxlength(minLength = 0, length) {
    return length > 0 && length > minLength;
  }

  /**
   * get parent object using property name
   */
  private getObjetFromSourceMeta(array, key) {
    return array.find((value) => {
      return value.name === key;
    });
  }

  private searchTree(element, matchingTitle) {
    let retunedValue = null;
    for (let j = 0; j < element.length; j++) {
      if (retunedValue !== null) {
        break;
      }
      if (element[j].name === matchingTitle) {
        retunedValue = element[j];
        break;
      } else if (element[j].children.length !== 0) {
        retunedValue = this.searchTree(element[j].children, matchingTitle);
      }
    }
    return retunedValue;
  }

  /**
   * call when click save button
   * saving meta after changes
   */
  saveWorkflowMeta() {
    this.workflowService.workflowMeta = this.dataSource;
    this.restructureDataSourceForSave(this.dataSource, '');
    this.dialogRef.close({ action: 'save', data: this.saveMetaObject });
  }
  private restructureDataSourceForSave(array, parent, fieldType?) {
    array.forEach(element => {
      const childrens = [...element.children];
      delete element.children;
      if (parent && element.name) {
        if (fieldType === 'object') {
          if (parent['properties']) {
            parent['properties'][element.name] = element;
            // parent['properties'].type = typeof (element);
          } else {
            parent['properties'] = { [element.name]: element };
          }
        } else if (fieldType === 'array') {
          if (parent['items']) {
            parent['items']['properties'][element.name] = element;
           // parent['items'].type = typeof (element);
          } else {
            parent['items'] = {
              type: typeof (element),
              properties: {
                [element.name]: element
              },
            };
          }
        }
      } else {
        this.saveMetaObject[element.name] = {
          name: element.name,
          type: element.type,
          description: element.description,
          order: element.order,
          id: element.id,
          fullName: element.fullName
        };
      }
      if (childrens.length > 0) {
        const obj = this.getObject(this.saveMetaObject, element.fullName);
        this.restructureDataSourceForSave(childrens, obj, element.type);
      }
    });
  }

  getObject(obj, objPath) {
    let jsonPathArr = objPath.split('.');
    const last = jsonPathArr.pop();
    jsonPathArr.forEach(e => {
      if (obj[e].type === 'object') {
        return (obj[e] = obj[e] || {}) && (obj = obj[e]['properties']);
      } else if (obj[e].type === 'array') {
        return (obj[e] = obj[e] || {}) && (obj = obj[e]['items']['properties']);
      } else {
        return (obj[e] = obj[e] || {}) && (obj = obj[e]);
      }
    });
    return obj[last];
  }

  /**
   * expand and collapse tree
   */
  expandCollpaseAll(treeNodes, stack, expandCollpaseFlag) {
    if (expandCollpaseFlag) {
      this.metaTree.treeModel.collapseAll();
    } else {
      this.metaTree.treeModel.expandAll();
    }
  }
  addNewField() {
    this.addingNewField = true;
    this.dialogRef.updateSize('40%', '65%');
  }

  cancelAddNewField() {
    this.addingNewField = false;
    this.resetNewField();
    this.dialogRef.updateSize('60%', '85%');
  }

  saveNewField(currentField, newField) {
    if (currentField) {
      currentField.children.push({
        name: newField['ui-label'], children: [], 'ui-label': newField['ui-label'],
        type: newField.type, expanded: true
      });
    } else {
      this.sourceMeta.push({
        name: newField['ui-label'], children: [], 'ui-label': newField['ui-label'],
        type: newField.type, expanded: true
      });
      this.dataSource = this.sourceMeta;
      this.utilsService.showSuccess('New field added successfully ', '');
    }
    this.cancelAddNewField();
  }

  resetNewField() {
    this.newField = { name: '', 'ui-label': '', type: 'string', children: [] };
  }
}
