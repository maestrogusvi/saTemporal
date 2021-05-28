import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { RoleMappingService } from '../role-mapping.service';
import { UtilsService } from '../../shared/utils.service';
import { IRoleMapping } from '../role-mapping.interface';
import {IGrpRole} from '../grp-role.interface';
import {IBrand} from '../../../interfaces/IBrand';
import {ISTRole} from '../st-role.interface';


@Component({
  selector: 'sapper-add-edit-connection',
  templateUrl: './add-edit-connection.component.html',
  styleUrls: ['./add-edit-connection.component.scss']
})
export class AddEditConnectionComponent implements OnInit {
  grpSelect = new FormControl(true);
  securityRoleSelect = new FormControl(true);
  brandInput = new FormControl();
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
  applicationList: any;
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

  getRoleMappingList(marketGroupId, brand): void {
    this.roleMappingService.getGrpRoles(marketGroupId, brand).subscribe(data => {
      this.grpRoleList = data.data;
      if (this.connectionData.grpRole === undefined) {
        this.connectionData.grpRole = this.grpRoleList[0];
      }
      this.grpSelect.reset(false);
    },
      error => {
        this.grpRoleList = undefined;
        this.grpSelect.reset(true);
      });
  }

  getBrandsListing(): void {
    this.roleMappingService.getBrandsListing().subscribe(data => {
      this.brandList = data.data;
      if (this.connectionData.brand) {
        this.brandInput.setValue(this.connectionData.brand.brandId);
      }
      this.validateBrandRole();
    });
  }

  validateBrandRole(): void {
    if (this.connectionData) {
      if (this.connectionData.brand && this.connectionData.marketGroupId) {
        this.getRoleMappingList(this.connectionData.marketGroupId, this.connectionData.brand);
        this.getSecurityRoleListing(this.connectionData.marketGroupId, this.connectionData.brand);
      }
    }

  }

  getSecurityRoleListing(marketGroupId, brand): void {
    this.roleMappingService.getSecurityRoleListing(marketGroupId, brand).subscribe(data => {
      this.stSecurityList = data.data;
      if (this.connectionData.stRole === undefined) {
        this.connectionData.stRole = this.stSecurityList[0];
      }
      this.securityRoleSelect.reset(false);
      },
      error => {
        this.stSecurityList = undefined;
        this.securityRoleSelect.reset(true);
      });
  }

  getMarketGroupIds(): void {
    this.roleMappingService.getMarketGroupIds().subscribe(data => {
      this.marketIds = data.data;
      this.validateBrandRole();
    });

  }

  saveRoleMapping(): void {

    if ( this.connectionData.id) {
      const datas = {
        marketGroupId: this.connectionData.marketGroupId,
        roleMappingListDTO: [{
          id: this.connectionData.id,
          grpRoleId: this.grpRoleList.find( grp => grp.grpRoleId === this.connectionData.grpRole.grpRoleId).id,
          stRoleId: this.stSecurityList.find( grp => grp.stRoleId === this.connectionData.stRole.stRoleId).id,
          brand: this.connectionData.brand
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
          brand: this.connectionData.brand
        }]
      };
      this.roleMappingService.postRoleMapping(datas).subscribe(data => {
        this.utilsService.showSuccess('Role mapping has been created', '');
      });
    }
    this.dialogRef.close(true);
  }


}
