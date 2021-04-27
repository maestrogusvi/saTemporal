import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '../../../shared/utils.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../confirm-dialog/confirm-dialog.component';
import 'froala-editor/js/plugins.pkgd.min.js';
import { SqlClientService } from './sql-client.service';
import { ConnectionService } from 'src/app/pages/connections/connection.service';
import { AddEditConnectionComponent } from 'src/app/pages/connections/add-edit-connection/add-edit-connection.component';
import { WorkflowService } from '../../workflow.service';

@Component({
  selector: 'sapper-sql-client',
  templateUrl: './sql-client.component.html',
  styleUrls: ['./sql-client.component.scss']
})
export class SqlClientComponent implements OnInit {

  contentTypes = ['JSON'];
  connectionList: any[];
  namedparamKeys = [];
  taskProperties = {
    queryType: '',
    query: '',
    namedParameters: {},
    isBatchExecution: false,
    batchDataExpression: ''
  };
  connectionType = [
    {
      key: 'Rest Token',
      value: 'REST_TOKEN'
    }, {
      key: 'Rest API Key',
      value: 'REST_API_KEY'
    }, {
      key: 'Rest Basic',
      value: 'REST_BASIC'
    }, {
      key: 'Rest OAuth',
      value: 'REST_OAUTH2'
    }, {
      key: 'SQL',
      value: 'SQL'
    }];
  queryTypes = [
    {
      key: 'Select',
      value: 'SELECT'
    }, {
      key: 'Insert',
      value: 'INSERT'
    }, {
      key: 'Update',
      value: 'UPDATE'
    }, {
      key: 'Delete',
      value: 'DELETE'
    }];
  selectedConnection;
  batchExpValue;
  batchExpressionOptions;

  @Output() isQueryVerified = new EventEmitter<any>();
  @Output() isSourceDataDeleted = new EventEmitter<any>();
  @Input() droppedNode;
  @Input() dragDataObj;
  @Input() set taskDetails(taskDetails) {
    if (taskDetails) {
      this.taskProperties = taskDetails;
      this.populateNamedParams();
      if (this.taskProperties.batchDataExpression) {
        this.batchExpressionOptions = this.utilsService.createFroalaOptions('', this.taskProperties.batchDataExpression);
      }
    }
  }
  @Input() set connection(connection) {
    this.getConnectionsByType();
    this.selectedConnection = connection;
  }

  constructor(
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private sqlClientService: SqlClientService,
    private connectionService: ConnectionService,
    private workflowService: WorkflowService) {
    this.batchExpressionOptions = this.utilsService.createFroalaOptions(
      this.batchExpValue,
      this.utilsService.templateToSlot(this.taskProperties.batchDataExpression, this.dragDataObj));
  }

  ngOnInit(): void {
    this.getConnectionsByType();
    this.workflowService.propertySave.subscribe((data) => {
      if (this.droppedNode.sapper_prop.sappertasktype === data) {
        if (this.taskProperties.batchDataExpression.includes('<span')) {
          this.taskProperties.batchDataExpression = this.utilsService.convertSlotToTemp(this.taskProperties.batchDataExpression);
        }
      }
    });
  }

  /**
   * Used to populate named parameters
   * @returns void
   */
  populateNamedParams(): void {
    this.namedparamKeys = [];
    if (this.taskProperties && this.taskProperties.namedParameters) {
      for (const objKey in this.taskProperties.namedParameters) {
        if (Object.prototype.hasOwnProperty.call(this.taskProperties.namedParameters, objKey)) {
          const urlOptions = this.utilsService.createFroalaOptions(
            this.taskProperties.namedParameters[objKey],
            this.utilsService.templateToSlot(this.taskProperties.namedParameters[objKey], this.dragDataObj));
          this.namedparamKeys.push({
            key: objKey,
            value: this.taskProperties.namedParameters[objKey],
            options: urlOptions
          });
        }
      }
    }
  }
  /**
   * Used to get connection by type
   */
  getConnectionsByType() {
    this.droppedNode.connectionType = 'SQL';
    this.connectionService.getConnectionListingByType(this.droppedNode.connectionType).subscribe(data => {
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
  /**
   * API integration for validate sql query
   * @returns void
   */
  validateSqlQuery(): void {
    this.namedparamKeys = [];
    this.taskProperties.namedParameters = {};
    this.sqlClientService.validateQuery(this.taskProperties.query).subscribe((response) => {
      this.isQueryVerified.emit(true);
      if (!this.taskProperties.isBatchExecution) {
        if (response && response.data) {
          const namedparams = this.utilsService.fetchResponseData(response);
          namedparams.forEach(element => {
            const found = this.namedparamKeys.some(el => el.key === element);
            if (!found) {
              const urlOptions = this.utilsService.createFroalaOptions();
              this.namedparamKeys.push({ key: element, value: '', options: urlOptions });
              this.taskProperties.namedParameters[element] = '';
            }
          });
        }
      }
    });
  }

  onBatchProcessingChange(event): void {
    this.taskProperties.isBatchExecution = event.checked;
    if (event.checked) {
      this.namedparamKeys = [];
      this.taskProperties.namedParameters = {};
    } else {
      this.taskProperties.batchDataExpression = '';
    }
  }

  /**
   * Used to set named params object dynamically
   * @param  {number} index
   * @param  {string} key
   * @param  {event} event
   * @returns void
   */
  onChangeOfParamsValue(index, key, event): void {
    this.namedparamKeys[index].value = this.utilsService.convertSlotToTemp(event, true);
    this.taskProperties.namedParameters[key] = this.namedparamKeys[index].value;
  }
  /**
   * Used to open connection dialog on create and edit connection
   * @param  {any} connection
   */
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
}
