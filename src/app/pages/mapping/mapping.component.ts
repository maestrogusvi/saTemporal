import { Component, OnInit, Inject, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { jsPlumb } from 'jsplumb';
import { TreeComponent, ITreeOptions, TREE_ACTIONS } from '@circlon/angular-tree-component';
import { v4 as uuidv4 } from 'uuid';

import { ITreeNodes, IMapping, IMappingRow, IInputOutputField, ICustomExpression, IDataList } from './mapping.interface';
import { UtilsService } from '../shared/utils.service';
import { WorkflowService } from '../workflow/workflow.service';
import { MetaJsonToTreeFormatPipe } from 'src/app/core/pipe/meta-json-to-tree-format.pipe';
import { WorkflowConstant } from '../workflow/workflow-constant.providers';
import { MappingService } from './mapping.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

declare const require: any;
const type = 'string/number';
const formulaList = require('./transformation-formulas.json');
@Component({
  selector: 'sapper-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit {

  @ViewChild('sourceTree') sourceTree: TreeComponent;
  @ViewChild('targetTree') targetTree: TreeComponent;
  @ViewChild('formulaTree') formulaTree: TreeComponent;
  @ViewChild('scriptEditor') scriptEditor;
  @ViewChild('selectedSourceTree') selectedSourceTree: TreeComponent;
  @ViewChildren('targetField') targetField: QueryList<ElementRef>;
  @ViewChildren('sourceField') sourceField: QueryList<ElementRef>;

  showDot = false;
  activeTab = 'mapping';
  activeMappingTab = 'fieldMapping';
  sourceFields: ITreeNodes[] = [];
  targetFields: ITreeNodes[] = [];
  formulaList = formulaList.TransformationFormulas;
  mappings: IMapping = {
    mappings: {
      mapping: []
    },
    dataSourceList: [],
    dataTargetList: []
  };
  options = {
    allowDrag: true
  };
  selectedNodeOptions: ITreeOptions = {
    displayField: 'fieldName'
  };
  formulaTreeOptions: ITreeOptions = {
    displayField: 'name',
    childrenField: 'formulas',
    isExpandedField: 'expanded',
    actionMapping: {
      mouse: {
        click: (tree, node, $event) => {
          TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
        }
      },
    }
  };
  visible = true;
  selectable = true;
  removable = true;
  search = { sourceField: '', targetField: '' };
  selectedSource = [];
  selectedTarget = [];
  isSourceExpanded: boolean;
  isTargetExpanded: boolean;
  isFormulaExpanded: boolean;
  isFormulaToggleOpned = true;
  transformationFormula: string;
  mentionConfig = {
    mentions: [
      {
        items: [],
        labelKey: 'fieldName',
        triggerChar: '#'
      },
      {
        items: this.getFormulaeArray(),
        triggerChar: '@',
        mentionSelect: this.getFormula
      }
    ]
  };
  metaData = [];
  panelOpenState = false;
  pathArray = [];
  jsPlumbInstance;
  currentTargetElement;
  currentSourceElement;
  partialMapping = {};
  inputFields = [];
  outputFields = [];
  mappingExpression: string;
  mappingType = 'Field Mapping';
  mappingScript: string;
  functionName: string;
  mappingTabIndex = 0;

  constructor(
    public dialogRef: MatDialogRef<MappingComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    readonly utilService: UtilsService,
    public workflowConstant: WorkflowConstant,
    readonly workflowService: WorkflowService,
    readonly mappingService: MappingService
  ) { }

  ngOnInit(): void {
    this.jsPlumbInstance = jsPlumb.getInstance();
    this.setDialogHeight();
    this.fetchMetaOnInit();
    if (this.data.mappingId) {
      setTimeout(() => {
        this.getMappingById();
      }, 1000);
    }
  }

  /**
   * Used to get mapping by mapping Id
   * @returns void
   */
  private getMappingById(): void {
    this.mappingService.getMappingById(this.data.mappingId).subscribe((mapping) => {
      if (mapping && mapping.data && mapping.data.mappings) {
        this.mappings = this.utilService.fetchResponseData(mapping);
        this.mappings.mappings.mapping.forEach((item, index) => {
          if (this.targetTree) {
            if (item.outputFields.length > 0) {
              this.currentTargetElement = this.targetTree.treeModel.getNodeById(item.outputFields[0].id);
            }
            this.setMappingType(item.mappingTypeEnum);
            this.activeMappingTab = item.mappingTypeEnum === 'CUSTOM_EVALUATION' ? 'scripting' : 'fieldMapping';
            setTimeout(() => {
              this.mappingTabIndex = item.mappingTypeEnum === 'CUSTOM_EVALUATION' ? 1 : 0;
            });
            if (item.mappingTypeEnum === 'CUSTOM_EVALUATION' && item.customExpression) {
              this.functionName = item.customExpression.functionName;
              setTimeout(() => { this.mappingScript = item.customExpression.script; });
              this.updateMentionFields();
            } else {
              this.mappingExpression = item.expression;
            }
            if (item.outputFields.length > 0 && item.inputFields.length > 0) {
              this.setSelectedSourceTarget(true, this.currentTargetElement.id, 'selectedTarget');
              item.inputFields.forEach(input => this.setSelectedSourceTarget(true, input.id, 'selectedSource'));
              if (this.sourceTree && this.targetTree) {
                this.sourceTree.treeModel.expandAll();
                this.targetTree.treeModel.expandAll();
              }
              setTimeout(() => {
                this.updateSVGLines();
              });
              if (index === this.mappings.mappings.mapping.length - 1) {
                this.inputFields = item.inputFields;
                this.outputFields = item.outputFields;
              }
            }
          }
        });
      }
    }
      // The 2nd callback handles errors.
      // (err) => console.error(err),
      // The 3rd callback handles the "complete" event.
      // () => {
      //   this.mappings.mappings.mapping.forEach((map) => {
      //     if (this.targetTree) {
      //       if (map.outputFields[0].id === this.currentTargetElement.data.id) {
      //         this.inputFields = map.inputFields;
      //         this.outputFields = map.outputFields;
      //         this.updateMentionFields();
      //       }
      //     }
      //   });
      // }
    );
  }

  /**
   * Used to check is showing checkbox or not
   * @param  ITreeNodes node
   * @returns boolean
   */
  isShow(node): boolean {
    return node.data.type && node.data.type.toLowerCase() !== 'object' && node.data.type.toLowerCase() !== 'array';
  }

  /**
   * Used to fetch meta on mapping page init
   * @returns void
   */
  private fetchMetaOnInit(): void {
    if (this.data.sourceMetaIds.length > 0) {
      this.data.sourceMetaIds.forEach(element => {
        this.getMetaById(element, 'sourceFields', 'source');
      });
    }
    if (this.data.targetMetaIds.length > 0 && !this.data.targetMetaIds.includes('')) {
      this.data.targetMetaIds.forEach(element => {
        this.getMetaById(element, 'targetFields', 'target');
      });
    } else {
      this.data.sourceMetaIds.forEach(element => {
        this.getMetaById(element, 'targetFields', 'target');
      });
    }
  }
  /**
   * Used subscribe the getmeta method from service
   * @param  string metaId
   * @param  string variable
   * @returns void
   */
  private getMetaById(metaId, variable, prefix): void {
    this.workflowService.getMeta(metaId).subscribe((response) => {
      this.createMetaTree(variable, response.data, prefix);
    });
  }
  /**
   * Used to create tree from JSON
   * @param  string property
   * @param  any data
   * @returns void
   */
  private createMetaTree(property, data, prefix): void {
    this.metaData = JSON.parse(data.meta);
    if (!Array.isArray(this.metaData)) {
      this.metaData = this.utilService.updateTreeViewData(this.createIdForEachField(this.metaData, prefix));
    }
    this[property].push({
      metaId: data.id,
      meta: this.metaData,
      fileName: data.fileName,
      fileType: data.fileType,
    });
  }

  /**
   * Used to create the create the id for each field of meta
   * @param  {any} meta
   * @param  {string} prefix
   * @returns ITreeNodes
   */
  private createIdForEachField(meta: any, prefix: string): any {
    // tslint:disable-next-line: forin
    for (const propertyKey in meta) {
      if (typeof (meta[propertyKey]) === 'object') { meta[propertyKey].id = `${prefix}_${meta[propertyKey].id}`; }
      if (meta[propertyKey].type && typeof (meta[propertyKey]) === 'object' && meta[propertyKey].type.toLowerCase() === 'object') {
        this.createIdForEachField(meta[propertyKey].properties, prefix);
      } else if (meta[propertyKey].type && typeof (meta[propertyKey]) === 'object' && meta[propertyKey].type.toLowerCase() === 'array') {
        this.createIdForEachField(meta[propertyKey].items.properties || meta[propertyKey], prefix);
      }
    }
    return meta;
  }

  /**
   * Transform metaFields data into treeview readable object
   * @param meta metaData
   * @returns mappingFields
   */
  private updateTreeViewData(meta): any[] {
    const mappingFields = [];
    const metaCopy = meta;
    if (metaCopy) {
      if (metaCopy) {
        for (const propertyKey in metaCopy) {
          mappingFields.push(new MetaJsonToTreeFormatPipe().transform(metaCopy[propertyKey], propertyKey));
        }
      }
    }
    return mappingFields;
  }

  /**
   * Used to call on change of function name input of scripting tab
   * @param  {any} input
   * @returns void
   */
  onFunctionNameChange(input: any): void {
    const args = this.mappings.dataSourceList.map(item => item.alise).join(',');
    this.mappingScript = `function ${input.target.value}(${args}){}`;
  }

  /**
   * Used to call on click of tree nodes
   * @param  ITreeNodes node
   * @param  string variableName
   */
  nodeClicked(node, variableName) {
    this[variableName].toArray().forEach((field: ElementRef) => {
      if (node.id === field.nativeElement.value) {
        if (variableName === 'sourceField') {
          if (this.currentTargetElement) {
            this.currentSourceElement = node;
            this.treeClick(field, node, variableName);
          }
        } else {
          this.treeClick(field, node, variableName);
        }
      }
    });
  }

  /**
   * Used to call common method for each tree node click
   * @param  any field
   * @param  ITreeNodes node
   * @param  string variableName
   */
  private treeClick(field, node, variableName) {
    // field.nativeElement.checked = !field.nativeElement.checked;
    this[`${variableName}Clicked`](field.nativeElement.checked, node);
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

  /**
   * Used to call only on traget tree node click
   * @param  {boolean} isChecked
   * @param  {ITreeNodes} targetElement
   * @returns void
   */
  private targetFieldClicked(isChecked: boolean, targetElement: ITreeNodes): void {
    if (isChecked) { // If Target element is checked
      this.currentTargetElement = targetElement;
      this.inputFields = [];
      this.outputFields = [];
      this.outputFields.push(this.createEachMappingRow('target', targetElement, 'outputFields'));
      this.updateTreeNodes('selectedTargetTree');
    } else { // If target element is unchecked
      this.currentTargetElement = targetElement;
      this.inputFields = [];
      this.outputFields = [];
      this.removeItemFromPath();
      this.setMappingObj('target');
      this.currentTargetElement = null;
    }
    this.setSelectedSourceTarget(isChecked, targetElement.id, 'selectedTarget');
    this.resetTransformationData();
    setTimeout(() => {
      this.updateSVGLines();
    }, 0);
  }

  /**
   * Used to remove path from pathArray property when click on target field
   * @returns void
   */
  private removeItemFromPath(): void {
    const self = this;
    Object.keys(this.pathArray).reverse()
      .forEach(function (i) {
        if (self.pathArray[i].id === self.currentTargetElement.id) {
          self.removeSelectedSourceOnTargetClick(self, i);
          self.pathArray.splice(Number(i), 1);
        }
      });
  }

  /**
   * Used to remove sourceIds from selectedSource array when uncheck target field
   * @param  any self
   * @param  number i
   * @returns void
   */
  private removeSelectedSourceOnTargetClick(self, i): void {
    self.pathArray[i].sourceId.forEach(element => {
      if (self.selectedSource.indexOf(element) !== -1) { self.selectedSource.splice(self.selectedSource.indexOf(element), 1); }
    });
  }

  /**
   * Used to call only on source tree node click
   * @param  {boolean} isChecked
   * @param  {ITreeNodes} sourceElement
   * @returns void
   */
  private sourceFieldClicked(isChecked: boolean, sourceElement: ITreeNodes): void {
    const targetID = this.currentTargetElement.id;
    if (isChecked) { // if source is checked
      this.currentSourceElement = sourceElement;
      this.inputFields.push(this.createEachMappingRow('source', sourceElement, 'inputFields'));
      this.updateMentionFields();
      this.updateTreeNodes('selectedSourceTree');
    } else {
      // On uncheck remove sourceMappingFiled id from partial mapping
      const indexToRemove = this.inputFields.findIndex(field => field.id === sourceElement.id);
      this.inputFields.splice(indexToRemove, 1);
      this.updateMentionFields();
      this.updateTreeNodes('selectedSourceTree');

      const indexToRemoveFromPathArray = this.pathArray.findIndex(item => {
        return (item.sourceId.indexOf(sourceElement.id) !== -1) && (item.id === this.currentTargetElement.id);
      });
      this.pathArray.splice(indexToRemoveFromPathArray, 1);
    }
    if (this.activeMappingTab === 'fieldMapping') { this.setMappingType(this.inputFields.length > 1 ? 'MANY_TO_ONE' : 'ONE_TO_ONE'); }
    this.setMappingObj('source');
    this.setSelectedSourceTarget(isChecked, sourceElement.id, 'selectedSource');
    this.resetTransformationData();
    setTimeout(() => {
      this.updateSVGLines();
    }, 0);
  }

  /**
   * Used to create original mapping object
   * @param  {string} from
   * @returns void
   */
  setMappingObj(from: string): void {
    if (this.currentTargetElement) {
      const mappIndex = this.isMappingPresent();
      if (['source', 'expression'].includes(from.toLowerCase())) {
        if (mappIndex === -1) {
          this.mappings.mappings.mapping.push(this.createMappings());
        } else {
          this.mappings.mappings.mapping.splice(mappIndex, 1);
          this.mappings.mappings.mapping.push(this.createMappings());
        }
      } else {
        this.mappings.mappings.mapping.splice(mappIndex, 1);
      }
    } else {
      this.mappings.mappings.mapping.splice(0, 1);
      this.mappings.mappings.mapping.push(this.createMappings());
    }
    if (this.mappings.dataSourceList && this.mappings.dataSourceList.findIndex(item => item.id === this.data.sourceMetaIds[0]) === -1) {
      this.mappings.dataSourceList.push(
        this.getSourceTargetDataList('source', {
          id: this.data.sourceMetaIds[0],
          type: '',
          order: this.mappings.dataSourceList.length,
          alise: this.data.sourceMetaIds[0]
        })
      );
    }
    if (this.mappings.dataTargetList && this.mappings.dataTargetList.findIndex(item => item.id === this.data.targetMetaIds[0]) === -1) {
      this.mappings.dataTargetList.push(
        this.getSourceTargetDataList('target', {
          id: this.data.targetMetaIds[0],
          type: '',
          order: this.mappings.dataTargetList.length,
          alise: this.data.targetMetaIds[0]
        }));
    }
  }

  /**
   * Used to create data list for source and target
   * @param  {string} from
   * @param  {IDataList} data
   * @returns IDataList
   */
  private getSourceTargetDataList(from: string, data: IDataList): IDataList {
    const dataList = {
      id: data.id,
      type: data.type,
      order: data.order
    };
    if (from.toLowerCase() === 'source') {
      dataList['alise'] = data.alise;
    }
    return dataList;
  }

  /**
   * Used to find current mapping is present in original mapping object or not.
   * @returns number
   */
  private isMappingPresent(): number {
    return this.mappings.mappings.mapping.findIndex(item => {
      if (item.outputFields.length > 0) {
        return item.outputFields[0].id === this.currentTargetElement.id;
      }
      return;
    });
  }

  /**
   * Used to get mapping by target id
   * @param  {string} nodeId
   * @returns IMappingRow
   */
  private getMappingByTargetId(nodeId: string): IMappingRow {
    return this.mappings.mappings.mapping.find(map => map.outputFields[0].id === nodeId);
  }

  /**
   * Used to check target is mapped or not
   * @param  {string} targetId
   * @returns boolean
   */
  isMappedTarget(targetId: string): boolean {
    return this.selectedTarget.includes(targetId);
  }

  /**
   * Used to create element of mapping array
   * @returns IMappingRow
   */
  private createMappings(): IMappingRow {
    const mapping: IMappingRow = {
      inputFields: this.inputFields,
      outputFields: this.outputFields,
      mappingTypeEnum: this.mappingType,
      mappingId: uuidv4(),
      expression: this.mappingExpression
    };
    if (this.mappingType === 'CUSTOM_EVALUATION') {
      mapping.customExpression = this.createCustomExpression();
    }
    return mapping;
  }

  /**
   * Used to call when we changing transformation tabs i.e fieldMapping and Scripting
   * @param  {MatTabChangeEvent} tabChangeEvent
   * @returns void
   */
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.tab.textLabel.toLowerCase() === 'scripting') {
      this.activeMappingTab = 'scripting';
      this.setMappingType('CUSTOM_EVALUATION');
      this.mappingExpression = '';
    } else {
      this.setMappingType(this.inputFields.length > 1 ? 'MANY_TO_ONE' : 'ONE_TO_ONE');
      this.activeMappingTab = 'fieldMapping';
    }
    this.setMappingObj('expression');
  }

  /**
   * Used to create custom expression json
   * @returns ICustomExpression
   */
  private createCustomExpression(): ICustomExpression {
    return {
      language: 'JAVASCRIPT',
      script: this.mappingScript,
      functionName: this.functionName,
      sourceDocId: this.data.sourceMetaIds[0]
    };
  }

  /**
   * Used to create the elements of Input/Output fields array of mapping
   * @param  {string} from
   * @param  {ITreeNodes} node
   * @param  {string} fieldArray
   * @returns IInputOutputField
   */
  private createEachMappingRow(from, node, fieldArray): IInputOutputField {
    const nodePath = this.getParent(node);
    const inputOutputField: IInputOutputField = {
      id: node.id,
      path: nodePath,
      fieldType: node.data.type.toUpperCase(),
      fieldName: node.data.name,
      actions: [],
      alais: node.data.name,
      transformation: {},
    };
    if (from === 'source') {
      inputOutputField.status = 'PREDEFINED';
      inputOutputField.index = this[fieldArray].length;
      inputOutputField.sourceDocId = this.data.sourceMetaIds[0];
    }
    return inputOutputField;
  }

  /**
   * Used to set mapping type variable
   * @param  {string} mappingType
   * @returns void
   */
  private setMappingType(mappingType: string): void {
    this.mappingType = mappingType;
  }

  /**
   * Used to update SVG lines of selected mappings
   * @returns void
   */
  private updateSVGLines(): void {
    let sourceFieldElement;
    let targetFieldElement;
    if (this.currentTargetElement) {
      const currentElementId = this.currentTargetElement.id;
      targetFieldElement = document.getElementById(currentElementId) as HTMLInputElement;
      const endX = 450;
      const two = 2;
      const ten = 10;
      const threeTen = 310;
      const endY = targetFieldElement.offsetTop + targetFieldElement.offsetParent.offsetTop + (targetFieldElement.offsetHeight / two);
      const currentMapping = this.mappings.mappings.mapping.find(map => {
        if (map.outputFields.length > 0) {
          return map.outputFields[0].id === currentElementId;
        }
        return;
      });
      if (currentMapping) {
        const selectedInputs = [];
        currentMapping.inputFields.forEach((sourceField) => {
          sourceFieldElement = document.getElementById(sourceField.id) as HTMLInputElement;
          if (sourceFieldElement) {
            const startX = 5;
            const startY = sourceFieldElement.offsetTop + sourceFieldElement.offsetParent.offsetTop + (sourceFieldElement.offsetHeight / two);
            //check if path array consists of same element otherwise add new
            const checkPath = this.pathArray.findIndex(item => {
              return (item.sourceId.indexOf(sourceField.id) !== -1) && (item.id === currentElementId);
            });
            selectedInputs.push(sourceField.id);
            if (checkPath === -1) {
              this.pathArray.push({
                id: currentElementId,
                sourceId: selectedInputs,
                name: this.currentTargetElement.data.name,
                dimensions: ` M ${startX} ${startY} L ${(startX + ten)} ${startY}
      L ${(endX - threeTen)} ${endY}
      L ${endX} ${endY} `
              });
            }
          }
        });
      }
    }
  }

  /**
   * It will check weather given source is mapped with current target field
   * @param sourceId Source Field ID
   */
  isMappedWithTarget(sourceId: string): boolean {
    if (!this.currentTargetElement && !this.selectedSource) {
      return false;
    }
    return this.selectedSource.indexOf(sourceId) !== -1; // Returns true if source is found in target
  }

  /**
   * It will check weather given target is mapped with any source field
   * @param targetId Target Field ID
   */
  isCheckedTarget(targetId: string): boolean {
    return this.selectedTarget.indexOf(targetId) !== -1; // Returns true if target is found in target
  }

  /**
   * Used to set selected source and target ids into array
   * @param  boolean isChecked
   * @param  string targetId
   * @param  string variableName
   * @returns void
   */
  private setSelectedSourceTarget(isChecked: boolean, sourceId: string, variableName: string): void {
    const sourceIndex = this[variableName].indexOf(sourceId);
    if (isChecked && sourceIndex === -1) {
      this[variableName].push(sourceId);
    } else {
      if (!isChecked && sourceIndex !== -1) { this[variableName].splice(sourceIndex, 1); }
    }
  }

  /**
   * Used to show plus icon for mapped target fields
   * @returns boolean
   */
  isShowAddSource(nodeId): boolean {
    return !this.currentTargetElement && this.selectedTarget.indexOf(nodeId) !== -1;
  }

  /**
   * Used to set input output fields on target activation
   * @param  ITreeNodes node
   * @returns void
   */
  setInputOutputFieldsOnActivate(node): void {
    this.currentTargetElement = node;
    const inputData = this.mappings.mappings.mapping.filter(item => item.outputFields[0].id === node.id)[0].inputFields;
    this.inputFields.push(inputData[0]);
    this.updateMentionFields();
    this.updateTreeNodes('selectedSourceTree');
  }

  /**
   * Used to get formulae list as array of string
   * @returns Array
   */
  getFormulaeArray(): Array<any> {
    const formulaeList = this.formulaList.reduce((list, category) => list.concat(category.formulas), []);
    return formulaeList.reduce((formula, formulaObject) => formula.concat(formulaObject.name), []);
  }

  /**
   * Used to get function name in uppercase format
   * @param  {any} item
   * @returns string
   */
  private getFormula(item: any): string {
    return item.label.toUpperCase();
  }

  /**
   * Used to close dialog
   * @returns void
   */
  closeDialog(data = null): void {
    this.dialogRef.close(data);
  }
  /**
   * Used to expand all tree nodes
   * @param  string tree
   * @param  string expandVariable
   */
  expandAll(tree, expandVariable) {
    this[tree].treeModel.expandAll();
    this[expandVariable] = !this[expandVariable];
  }
  /**
   * Used to collapse all tree nodes
   * @param  string tree
   * @param  string expandVariable
   */
  collapseAll(tree, expandVariable) {
    this[tree].treeModel.collapseAll();
    this[expandVariable] = !this[expandVariable];
  }

  /**
   * Search the entered source and targetfields
   * @param text Field name to be searched
   * @param tree tree to be searched for
   */
  filterNodes(text: string, tree: any): void {
    tree.treeModel.filterNodes(text.trim(), true);
  }

  /**
   * Used to create tree search box
   * @param  any tree
   * @returns void
   */
  clearFilter(tree: any, searchBox: HTMLInputElement): void {
    searchBox.value = '';
    tree.treeModel.clearFilter();
  }
  /**
   * Used to save mapping into the database
   * @returns void
   */
  saveMapping(): void {
    if (this.data.mappingId) {
      this.mappingService.updateMapping(this.mappings).subscribe(data => {
        data = this.utilService.fetchResponseData(data);
        this.utilService.showSuccess('Mapping updated successfully!', '');
        this.closeDialog(data.id);
      });
    } else {
      this.mappingService.createMapping(this.mappings).subscribe(data => {
        data = this.utilService.fetchResponseData(data);
        this.utilService.showSuccess('Mapping saved successfully!', '');
        this.closeDialog(data.id);
      });
    }
  }

  /**
   * Used edit mapping
   * @param  {string} nodeId
   * @returns void
   */
  editMapping(nodeId: string): void {
    this.currentTargetElement = this.targetTree.treeModel.getNodeById(nodeId);
    const currentMapping = this.getMappingByTargetId(nodeId);
    if (currentMapping.mappingTypeEnum.toUpperCase() === 'CUSTOM_EVALUATION') {
      this.setScriptDetails(currentMapping);
    } else {
      this.setFieldMappingDetails(currentMapping);
    }
  }

  /**
   * Used to set scripting details on edit mapping
   * @param  {IMappingRow} currentMapping
   * @returns void
   */
  private setScriptDetails(currentMapping: IMappingRow): void {
    this.mappingTabIndex = 1;
    if (currentMapping.customExpression) {
      this.functionName = currentMapping.customExpression.functionName;
      this.mappingScript = currentMapping.customExpression.script;
    }
  }

  /**
   * Used to set field mapping on edit mapping
   * @param  {IMappingRow} currentMapping
   * @returns void
   */
  private setFieldMappingDetails(currentMapping: IMappingRow): void {
    this.mappingTabIndex = 0;
    this.setSelectedSourceTarget(true, this.currentTargetElement.id, 'selectedTarget');
    currentMapping.inputFields.forEach(input => this.setSelectedSourceTarget(true, input.id, 'selectedSource'));
    this.inputFields = currentMapping.inputFields;
    this.outputFields = currentMapping.outputFields;
    this.mappingExpression = currentMapping.expression;
    this.updateMentionFields();
  }

  /**
   * Used to set selected source into mention items.
   * @returns void
   */
  private updateMentionFields(): void {
    this.inputFields.forEach(item => {
      const index = this.mentionConfig.mentions[0].items.findIndex(mention => mention.id === item.id);
      if (index === -1) {
        this.mentionConfig.mentions[0].items.push(item);
      }
    });
  }

  /**
   * Used to set passed tab as active tab.
   * @param  string tab
   * @returns void
   */
  setActiveTab(tab): void {
    this.activeTab = tab;
    this.setDialogHeight();
  }
  /**
   * Used to map selected source and target with backend
   * @returns void
   */
  mapSelectedFields(): void {

  }
  /**
   * Used to get cancel button as per active tab
   * @returns string
   */
  getCancelBtnLbl(): string {
    return this.activeTab === 'mapping' ? 'Cancel' : 'Back';
  }
  /**
   * Used to perform action on cancel or back button click
   * @returns void
   */
  cancelOrBack(): void {
    if (this.activeTab === 'mapping') {
      this.closeDialog();
    } else {
      this.setActiveTab('mapping');
    }
  }
  /**
   * Used to validate transformation icon
   * @param  any mapping
   * @returns boolean
   */
  validateTransformationBtn(mapping): boolean {
    return mapping.source.length > 0 && mapping.target.length > 0;
  }
  /**
   * Used to validate save buttonn of mapping tab
   * @returns boolean
   */
  validateMappings() {
    // const isValid = [];
    // this.mappings.mappings.forEach(item => {
    //   const result = item.source.length > 0 && item.target.length > 0;
    //   isValid.push(result);
    // });
    // return isValid.includes(false);
  }

  /**
   * Used to update the tree nodes by using variable name dynamically
   * @param  {string} variableName
   * @returns void
   */
  private updateTreeNodes(variableName: string): void {
    if (this[variableName]) {
      this[variableName].treeModel.update();
    }
  }

  /**
   * Used to reset transformation details when needed
   * @returns void
   */
  private resetTransformationData(): void {
    this.mappingExpression = '';
    this.mappingScript = '';
    this.functionName = '';
  }

  /**
   * Used to set styles dynamically of dialog height and all.
   * @returns void
   */
  setDialogHeight(): void {
    // const height = this.activeTab === 'mapping' ? '42vw' : '42vw';
    // const maxHeight = this.activeTab === 'mapping' ? '50vw' : '50vw';
    const height = '42vw';
    const maxHeight = '50vw';
    const width = this.activeTab === 'mapping' ? '90vw' : '70vw';
    document.documentElement.style.setProperty('--mapping-dialog-width', width);
    document.documentElement.style.setProperty('--mapping-dialog-max-height', maxHeight);
    document.documentElement.style.setProperty('--mapping-dialog-height', height);
    document.documentElement.style.setProperty('--mat-dialog-container-max-height', maxHeight);
    document.documentElement.style.setProperty('--mat-dialog-container-height', height);
  }

  /**
   * Used to get dialog title
   * @returns string
   */
  getDialogTitle(): string {
    return this.activeTab === 'mapping' ? 'Mapping' : 'Transformation';
  }

  /**
   * To open example modal
   * @param node
   */
  openExampleModal(node) {
    if (node.data.formulas === undefined) {
      // this.modalService.show(TransformationExampleModalComponent, {
      //   class: 'modal-sm',
      //   backdrop: true, ignoreBackdropClick: true,
      //   initialState: { node }
      // });
      // this.isModelOpen = true;
    }
  }
}
