import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { RoleMappingService } from '../role-mapping.service';
import { UtilsService } from '../../shared/utils.service';
import { IRoleMapping } from '../role-mapping.interface';
import {IApplicationLov} from '../../app-store/app-store.interface';
import {IGrpRole} from '../grp-role.interface';
import {IBrand} from '../../../interfaces/IBrand';
import {ISTRole} from '../st-role.interface';


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
  }];
  searchApp;
  applicationList: IApplicationLov[];
  connectionData: IRoleMapping;
  connectionDataOnEdit: IRoleMapping;
  public enableBtnSave = false;
  file: File;
  grpRoleList: IGrpRole[];
  stSecurityList: ISTRole[];
  brandList: IBrand[];
  marketIds: string[];

  constructor(
    public dialogRef: MatDialogRef<AddEditConnectionComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private utilsService: UtilsService,
    private roleMappingService: RoleMappingService) {

    this.connectionDataOnEdit = data;
  }

  ngOnInit(): void {
    this.getBrandsListing();
    this.getMarketGroupIds();
    this.getRoleMappingList();
    this.getSecurityRoleListing();
    if (this.connectionDataOnEdit.id) {
      this.connectionData = this.connectionDataOnEdit;
    } else {
      this.connectionData = {
        brand: undefined, grpRole: undefined, marketGroupId: '', stRole: undefined,
        id: ''
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

  getRoleMappingList(): void {
    this.roleMappingService.getGrpRoles().subscribe(data => {
      this.grpRoleList = data.data;
    });

  }

  getBrandsListing(): void {
    this.roleMappingService.getBrandsListing().subscribe(data => {
      this.brandList = data.data;
    });

  }

  getSecurityRoleListing(): void {
    this.roleMappingService.getSecurityRoleListing().subscribe(data => {
      this.stSecurityList = data.data;
    });

  }

  getMarketGroupIds(): void {
    this.roleMappingService.getMarketGroupIds().subscribe(data => {
      this.marketIds = data.data;
    });

  }

  saveRoleMapping(): void {

    if ( this.connectionData.id) {
      const datas = {
        marketGroupId: this.connectionData.marketGroupId,
        roleMappingListDTO: [{
          id: this.connectionData.id,
          grpRoleId: this.connectionData.grpRole.id,
          stRoleId: this.connectionData.stRole.id,
          brand: this.connectionData.brand.brandId
        }]
      };
      this.roleMappingService.putRoleMapping(datas).subscribe(data => {
        this.utilsService.showSuccess('Role mapping has been edited', '');
      });
    } else {
      const datas = {
        marketGroupId: this.connectionData.marketGroupId,
        roleMappingListDTO: [{
          grpRoleId: this.connectionData.grpRole.id,
          stRoleId: this.connectionData.stRole.id,
          brand: this.connectionData.brand.brandId
        }]
      };
      this.roleMappingService.postRoleMapping(datas).subscribe(data => {
        this.utilsService.showSuccess('Role mapping has been created', '');
      });
    }
    this.dialogRef.close(true);
  }


}
