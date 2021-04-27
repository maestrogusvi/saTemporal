import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ITaskProperties } from '../../workflow.interface';
import { TpSourceService } from './tp-source.service';
import { ConnectionService } from '../../../connections/connection.service';
import { AddEditConnectionComponent } from 'src/app/pages/connections/add-edit-connection/add-edit-connection.component';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from 'src/app/pages/shared/utils.service';
import { WorkflowService } from '../../workflow.service';

@Component({
  selector: 'sapper-tp-source',
  templateUrl: './tp-source.component.html',
  styleUrls: ['./tp-source.component.scss']
})
export class TpSourceComponent implements OnInit {
  @Input() set connection(connection) {
    this.selectedConnection = connection;
  }
  @Input() set taskDetails(taskDetails) {
    if (taskDetails) {
      this.taskProperties = taskDetails;
      if (taskDetails.regularExpression) {
        this.selectedOption = this.readFileOptions[1];
        this.readFileOption = this.readFileOptions[1];
      } else if (taskDetails.files.length >= 1) {
        this.selectedOption = this.readFileOptions[0];
        this.readFileOption = this.readFileOptions[0];
        this.setFileReadOptions(this.readFileOption, this.droppedNode);
        this.taskProperties.files = taskDetails.files;
      }
    } else {
      this.selectedOption = {
        value: '',
        name: ''
      };
      this.taskProperties = {
        directoryPath: '',
        regularExpression: '',
        files: []
      };
    }
  }
  @Input() droppedNode;
  @Input() dragDataObj;
  readFileOption = { value: '', name: '' };
  taskProperties: ITaskProperties = {
    directoryPath: '',
    regularExpression: '',
    files: []
  };
  selectedFiles = [];
  selectedConnection;
  files = new FormControl();
  connectionList: any[];

  encodingTypes = [
    'UTF-8',
    'UTF-8 BOM'
  ];
  selectedOption = {
    value: '',
    name: ''
  };
  readFileOptions = [
    { value: 'fileName', name: 'Using file name' },
    { value: 'regularExpression', name: 'Using regular expression' }
  ];
  fileList: string[];

  constructor(
    private tpSourceService: TpSourceService,
    private connectionService: ConnectionService,
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private workflowService: WorkflowService
  ) { }

  ngOnInit(): void {
    this.getConnectionsByType();
  }

  /**
   * To get file list
   * @param event: any
   * @param droppedNode: any
   * @returns void
   */
  setFileReadOptions(event, droppedNode): void {
    const connectionId = droppedNode.connectionId ? droppedNode.connectionId : this.selectedConnection?.id;
    // const connectionId = this.selectedConnection?.id;
    if (event.value.value === 'fileName' || event.value === 'fileName') {
      // API call
      this.taskProperties.regularExpression = '';
      switch (droppedNode.sapper_prop.connectionType) {
        case 'FTP':
          this.tpSourceService.getFtpFileList(connectionId,
            this.utilsService.convertSlotToTemp(this.taskProperties.directoryPath)).subscribe(data => {
              this.fileList = data.data;
            });
          break;
        case 'SFTP':
          this.tpSourceService.getSftpFileList(connectionId,
            this.utilsService.convertSlotToTemp(this.taskProperties.directoryPath)).subscribe(data => {
              this.fileList = data.data;
            });
          break;
        case 'S3':
          this.tpSourceService.getS3FileList(connectionId,
            this.utilsService.convertSlotToTemp(this.taskProperties.directoryPath)).subscribe(data => {
              this.fileList = data.data;
            });
          break;

        default:
          this.tpSourceService.getFtpFileList(connectionId,
            this.utilsService.convertSlotToTemp(this.taskProperties.directoryPath)).subscribe(data => {
              this.fileList = data.data;
            });
          break;
      }
    } else {
      this.taskProperties.files = [];
    }
    this.readFileOption = event.value;
  }

  openCreateConnectionDialog(connection) {
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
        this.selectedConnection = this.connectionList.filter(connection => connection.id === this.selectedConnection.id);
      }
    });
  }

  onBlurDirectoryPathEvent() {
    if (this.taskProperties.files.length >= 1 && this.selectedConnection.id) {
      this.setFileReadOptions(this.selectedOption, this.droppedNode);
    }
  }

  onBlurSelectConnectionEvent() {
    if (this.taskProperties.files.length >= 1 && this.taskProperties.directoryPath) {
      this.setFileReadOptions(this.selectedOption, this.droppedNode);
    }
  }

  directoryPathModelChange($event) {
    return this.taskProperties.directoryPath = $event.replace(/(<p>|<\/p>)/img, '');
  }

  /**
   * To update mat select
   * @param attribute1: any
   * @param attribute2: any
   */
  attributeDisplay(firstAttribute, secondAttribute) {
    if (firstAttribute.id === secondAttribute.id) {
      return firstAttribute.name;
    } else {
      return '';
    }
  }
}
