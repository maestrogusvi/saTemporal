import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MarketGroupService } from '../market-group.service';
import { UtilsService } from '../../shared/utils.service';
import { IMarketGroup } from '../market-group.interface';
import { AppStoreService } from '../../app-store/app-store.service';
import { IApplicationLov } from '../../app-store/app-store.interface';
import {IOrgType} from '../../../interfaces/IOrgType';
import {IBrand} from '../../../interfaces/IBrand';

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
  orgTypes = new FormControl();
  orgTypes1 = new FormControl();
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

  connectionData: IMarketGroup;
  applicationList: IApplicationLov[];
  connectionDataOnEdit: IMarketGroup;
  public enableBtnSave = false;
  file: File;
  oemCheck: boolean;
  activeCheck: boolean;
  useRangeCheck: boolean;
  orgTypeList: IOrgType[];
  orgTypeListSelected: IOrgType[];
  brandList: IBrand[];
  brandListSelected: IBrand[];

  constructor(
    public dialogRef: MatDialogRef<AddEditConnectionComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private utilsService: UtilsService,
    private marketGroupService: MarketGroupService,
    private appStoreService: AppStoreService) {
    this.connectionDataOnEdit = data;
  }

  ngOnInit(): void {
    this.getOrgTypeListing();
    this.getBrandsListing();
    if (this.connectionDataOnEdit.groupId) {
      this.connectionData = this.connectionDataOnEdit;
    } else {
      this.connectionData = {
        oem: false,
        comments: '',
        brandArray: [], orgTypeArray: [], sumtotalProdURL: '', sumtotalStageURL: '', topDomain: '', useRegions: false,
        groupId: '',
        groupName: '',
        brands: '',
        sapperTenant: '',
        orgTypes: '',
        hierarchyName: '',
        active: true
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
  getOrgTypeListing(): void {
    this.marketGroupService.GetOrgTypeListing().subscribe(data => {
      this.orgTypeList = data.data;
    });

  }
  getBrandsListing(): void {
    this.marketGroupService.GetBrandsListing().subscribe(data => {
      this.brandList = data.data;
    });

  }

  setAll(completed: boolean) {
  }
  saveMarketGroup() {
    if (this.brandListSelected.length > 0) {
      this.connectionData.brands = this.brandListSelected.join('');
    }
    if (this.orgTypeListSelected.length > 0 ) {
      this.connectionData.orgTypes = this.orgTypeListSelected.join('');
    }
    if ( this.connectionData.groupId) {
      this.marketGroupService.putMarketGroup(this.connectionData).subscribe(data => {
        this.utilsService.showSuccess('market Group has been edited', '');
        this.dialogRef.close(true);
      });
    } else {
      this.marketGroupService.postMarketGroup(this.connectionData).subscribe(data => {
        this.utilsService.showSuccess('New market Group has been created', '');
        this.dialogRef.close(true);
      });
    }

  }



}
