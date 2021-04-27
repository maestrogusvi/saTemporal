import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MetaConnectionComponent } from '../meta-connection/meta-connection.component';
import { WorkflowWindowService } from '../workflow-window/workflow-window.service';
import { WorkflowService } from '../workflow.service';
import { MetaProperties } from './meta';
import { IRequiredProperties } from './meta.interface';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { UtilsService } from '../../shared/utils.service';
import { MappingService } from '../../mapping/mapping.service';

@Component({
  selector: 'sapper-meta',
  templateUrl: './meta.component.html',
  styleUrls: ['./meta.component.scss']
})
export class MetaComponent implements OnInit {

  @Input() taskProperties;
  @Input() droppedNode;
  requiredProperties: IRequiredProperties = new MetaProperties().get();
  delelimiterTypes = [
    { label: 'COMMA', value: ',' },
    { label: 'SEMICOLON', value: ';' },
    { label: 'PIPE', value: '|' },
  ];
  delimeterType: { label: 'COMMA', value: ',' };
  metaData: { meta: string };
  escapeDisabled = [
    { label: 'true', value: 'true' },
    { label: 'false', value: 'false' },
  ];
  fileTypes = '.json,.csv,.xlsx';
  fileToUpload: File;
  fileTypeMeta = {
    'application/vnd.ms-excel': { fileType: 'CSV' },
    'text/csv': { fileType: 'CSV' },
    'application/json': { fileType: 'JSON' },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
      fileType: 'XLSX',
    },
  };
  skipHeaderRecord = [
    { label: 'true', value: 'true' },
    { label: 'false', value: 'false' },
  ];
  ignoreEmptyLines = [
    { label: 'true', value: 'true' },
    { label: 'false', value: 'false' },
  ];
  quoteDisabled = [
    { label: 'true', value: 'true' },
    { label: 'false', value: 'false' },
  ];

  constructor(
    public dialog: MatDialog,
    readonly workflowService: WorkflowService,
    private workflowWindowService: WorkflowWindowService,
    private utilsService: UtilsService,
    private mappingService: MappingService
  ) { }

  ngOnInit(): void {
  }


  /**
   *
   * @param files selecting file from upload
   */
  public selectedFile(files: FileList) {
    const zero = 0;
    this.fileToUpload = files.item(zero);
    this.taskProperties.fileType = this.fileTypeMeta[this.fileToUpload.type].fileType;
    this.taskProperties.fileName = this.fileToUpload.name;
  }

  /**
   * call when click on save
   */
  public uploadFile() {
    MetaProperties.prototype.set(this.requiredProperties);
    const requiredProperties = MetaProperties.prototype.get();
    const formData = new FormData();
    formData.append('file', this.fileToUpload);
    formData.append('requiredProperties', `${JSON.stringify(requiredProperties)}`
    );

    this.workflowService
      .uploadFile(this.taskProperties.fileType, formData)
      .subscribe((response) => {
        this.taskProperties.metaId = response.data.id;
        this.droppedNode.metaId = response.data.id;
        this.metaData = response['data'];
        this.openMetaUplaodDialog(JSON.parse(response['data'].meta));
      });
  }


  /**
   * open meta dialog for preview
   */
  private openMetaUplaodDialog(parsedMeta) {
    this.dialog
      .open(MetaConnectionComponent, {
        data: { isUploadedMeta: true, data: parsedMeta },
      })
      .afterClosed()
      .subscribe((item) => {
        // Edited Data sent to Component from Dialog
        if (item.action === 'save') {
          this.saveMeta(item.data);
        }
      });
  }


  private saveMeta(meta) {
    this.metaData.meta = JSON.stringify(meta);
    this.workflowService.saveMeta(this.metaData).subscribe();
  }


  resetRightPanelData() {
    this.taskProperties.fileType = '';
    this.taskProperties.fileName = '';
    this.taskProperties.delimeterType = { label: 'COMMA', value: ',' };
  }

  isFileTypeCsv(): boolean {
    if (this.taskProperties && this.taskProperties.fileType) {
      return this.taskProperties.fileType.toLowerCase() === 'csv';
    }
    return false;
  }

  deleteMeta(): void {
    const message = ' Are you sure you want to delete meta?';
    const dialogData = new ConfirmDialogModel(
      'Delete Meta Confirmation',
      message,
      true
    );
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.workflowService
          .deleteMeta(this.droppedNode.metaId)
          .subscribe(() => {
            this.droppedNode.metaId = '';
            this.utilsService.showSuccess('Meta deleted sucessfully.', '');
            if (this.isTransformationProperties()) {
              this.removeMapping();
            }
          });
      }
    });
  }

  private removeMapping(): void {
    this.mappingService
      .deleteMapping(this.droppedNode.mappingId)
      .subscribe(() => {
        delete this.droppedNode.mappingId;
        this.utilsService.showSuccess('Mappings are deleted successfully.', '');
      });
  }

  isTransformationProperties(): boolean {
    if (this.droppedNode && this.droppedNode.sapper_prop) {
      return (
        this.droppedNode.sapper_prop.sappertasktype === 'TRANSFORMATION'
      );
    }
    return false;
  }

}
