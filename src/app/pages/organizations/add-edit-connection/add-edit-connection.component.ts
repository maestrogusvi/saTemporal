import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { OrganizationsService } from '../organizations.service';
import { UtilsService } from '../../shared/utils.service';
import { IOrganization } from '../organizations.interface';
import { AppStoreService } from '../../app-store/app-store.service';
import { IApplicationLov } from '../../app-store/app-store.interface';

@Component({
  selector: 'sapper-add-edit-connection',
  templateUrl: './add-edit-connection.component.html',
  styleUrls: ['./add-edit-connection.component.scss']
})
export class AddEditConnectionComponent implements OnInit {
  selectedApplication: IApplicationLov = {
    id: '',
    name: ''
  };
  connectionForm: FormGroup;
  connectionTypeControl: FormControl;
  @ViewChild('addEditConnection') addEditConnection: TemplateRef<any>;
  @ViewChild('restConnection') restConnection;
  connectionType = [{
    key: 'S3',
    value: 'S3'
  }, {
    key: 'FTP',
    value: 'FTP'
  },
  {
    key: 'SFTP',
    value: 'SFTP'
  },
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
  },
  {
    key: 'SOAP',
    value: 'SOAP'
  }];
  searchApp;

  connectionData: IOrganization;
  applicationList: IApplicationLov[];
  connectionDataOnEdit: IOrganization;
  public enableBtnSave = false;
  file: File;

  constructor(
    public dialogRef: MatDialogRef<AddEditConnectionComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private utilsService: UtilsService,
    private connectionService: OrganizationsService,
    private appStoreService: AppStoreService) {

    this.connectionDataOnEdit = data;
  }

  ngOnInit(): void {
    if (this.connectionDataOnEdit.id) {
      this.connectionData = this.connectionDataOnEdit;
    } else {
      this.connectionData = {
        brandArray: [],
        id: '',
        organizationName: '',
        hierarchy: '',
        parentOrganizationCode: '',
        status: '',
        active: 0,
        orgUpdate: false,
        brand: '',
        region: '',
        organizationType: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        postalCode: ''
      };
    }
    this.createForm();
  }
  /**
   * This function is used for define the structure of connction form.
   */
  createForm() {
    this.connectionForm = new FormGroup({
    });
  }


  clearConnectionProperties() {
    if (this.restConnection) {
      if (this.restConnection ?.headerArr) {
        this.restConnection.headerArr = [{ headerKey: '', headerValue: '' }];
      }
      if (this.restConnection ?.queryParam) {
        this.restConnection.queryParam = [{ headerKey: '', headerValue: '' }];
      }
    }
    this.enableBtnSave = false;
  }
}
