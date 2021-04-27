import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { ISinkTaskProperties } from '../../workflow.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { ConnectionService } from 'src/app/pages/connections/connection.service';
import { AddEditConnectionComponent } from 'src/app/pages/connections/add-edit-connection/add-edit-connection.component';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '../../../shared/utils.service';
import 'froala-editor/js/plugins.pkgd.min.js';
import { WorkflowService } from '../../workflow.service';

@Component({
  selector: 'sapper-tp-sink',
  templateUrl: './tp-sink.component.html',
  styleUrls: ['./tp-sink.component.scss']
})
export class TpSinkComponent implements OnInit {

  @ViewChild('directoryPath', { static: true }) directoryPath;
  @ViewChild('fileName', { static: true }) fileName;
  @ViewChild('data', { static: true }) data;
  @Input() droppedNode;
  @Input() dataSlots;
  @Input() dragDataObj;
  @Input() connectionList;
  @Input() set connection(connection) {
    this.selectedConnection = connection;
  }
  @Input() set taskDetails(taskDetails) {
    if (taskDetails) {
      this.taskProperties = taskDetails;
      if (this.taskProperties.fileName) {
        this.fileNameOptions = this.utilsService.createFroalaOptions('', this.taskProperties.fileName);
      }
      if (this.taskProperties.directoryPath) {
        this.directoryPathOptions = this.utilsService.createFroalaOptions('', this.taskProperties.directoryPath);
      }
      if (this.taskProperties.data) {
        this.dataSlotOptions = this.utilsService.createFroalaOptions('', this.taskProperties.data);
      }
    }
  }

  tpSinkForm: FormGroup;
  selectedConnection;
  removeTag = false;
  content = 'data';
  fileNameEditorVal;
  fileNameOptions;
  compressFileNameVal;
  compressFileNameOptions;
  directoryPathVal;
  directoryPathOptions;
  encryptKeyEditorVal;
  encryptKeyOptions;
  dataSlotEditorVal;
  dataSlotOptions;
  selectedFiles = [];
  files = new FormControl();
  readFileOption = { value: '', name: '' };
  taskProperties: ISinkTaskProperties;
  encodingTypes = [
    'UTF-8',
    'UTF-8 BOM'
  ];
  fileList: string[];

  constructor(
    private connectionService: ConnectionService,
    private dialog: MatDialog,
    public utilsService: UtilsService,
    private workflowService: WorkflowService
  ) {
    this.fileNameOptions = this.utilsService.createFroalaOptions('');
    this.directoryPathOptions = this.utilsService.createFroalaOptions('');
    this.dataSlotOptions = this.utilsService.createFroalaOptions('');
  }

  ngOnInit(): void {
    this.getConnectionsByType();
    this.workflowService.propertySave.subscribe((data) => {
      if (this.droppedNode.sapper_prop.sappertasktype === data) {
        if (this.taskProperties.directoryPath.includes('<')) {
          this.taskProperties.directoryPath = this.utilsService.convertSlotToTemp(this.taskProperties.directoryPath);
        }
        if (this.taskProperties.fileName.includes('<')) {
          this.taskProperties.fileName = this.utilsService.convertSlotToTemp(this.taskProperties.fileName);
        }
        if (this.taskProperties.data.includes('<')) {
          this.taskProperties.data = this.utilsService.convertSlotToTemp(this.taskProperties.data);
        }
      }
    });
  }

  openCreateConnectionDialog(connection) {
    const connectionDataCopy = Object.assign({}, this.selectedConnection);
    const data = connection ? this.selectedConnection : {};
    const dialogRef = this.dialog.open(AddEditConnectionComponent, { data, width: '800px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getConnectionsByType();
      }
    });
  }

  getConnectionsByType() {
    this.connectionService.getConnectionListingByType(this.droppedNode.sapper_prop.connectionType).subscribe(data => {
      this.connectionList = data.data;
      if (this.selectedConnection) {
        this.connectionList.forEach(connection => {
          if (connection.id === this.selectedConnection.id) {
            this.selectedConnection = connection;
          }
        });
      }
    });
  }

  drop(event) { }

  /**
   * To update mat select
   * @param attribute1: any
   * @param attribute2: any
   */
  attributeDisplay(firstAttribute, secondAttribute) {
    if (firstAttribute.id === secondAttribute.id) {
      return firstAttribute.name;
    }
    return '';
  }
}
