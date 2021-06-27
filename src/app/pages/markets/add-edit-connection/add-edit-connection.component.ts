import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MarketsService } from '../markets.service';
import { UtilsService } from '../../shared/utils.service';
import { IMarket } from '../market.interface';
import {IBrand} from '../../../interfaces/IBrand';
import {MarketGroupService} from '../../market-groups/market-group.service';
import {IOrgType} from '../../../interfaces/IOrgType';
import {ICountry} from '../../../interfaces/ICountry';



@Component({
  selector: 'sapper-add-edit-connection',
  templateUrl: './add-edit-connection.component.html',
  styleUrls: ['./add-edit-connection.component.scss']
})
export class AddEditConnectionComponent implements OnInit {
  orgTypes = new FormControl();
  orgTypes1 = new FormControl();
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
  connectionData: IMarket;
  connectionDataOnEdit: IMarket;
  public enableBtnSave = false;
  file: File;
  orgTypeListSelected: IOrgType[];
  brandList: IBrand[];
  brandListSelected: IBrand[];
  orgTypeList: IOrgType[];
  countries: ICountry[];
  marketIds: string[];
  activeCheck = false;

  constructor(
    public dialogRef: MatDialogRef<AddEditConnectionComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private utilsService: UtilsService,
    private marketGroupService: MarketGroupService,
    private roleMappingService: MarketsService) {

    this.connectionDataOnEdit = data;
  }

  ngOnInit(): void {
    this.getBrandsListing();
    this.getOrgTypeListing();
    this.getMarketGroupIds();
    this.getCountriesListining();
    if (this.connectionDataOnEdit.marketId) {
      this.connectionData = this.connectionDataOnEdit;
      if (this.connectionData.active === 1) {
        this.activeCheck = true;
      }
    } else {
      this.connectionData = {
        active: 0, brandArray: [], brands: '', country: '', marketId: '', name: '', orgTypeArray: [], orgTypes: ''

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
      this.orgTypeList =  this.orgTypeList.sort((a, b) => {
        const aName = a.typeName.toUpperCase();
        const bName = b.typeName.toUpperCase();
        if (aName > bName) { return 1; }
        if (aName < bName) { return -1; }
        return 0;
      });
    });

  }

  getBrandsListing(): void {
    this.roleMappingService.getBrandsListing().subscribe(data => {
      this.brandList = data.data;
      this.brandList =  this.brandList.sort((a, b) => {
        const aName = a.brandName.toUpperCase();
        const bName = b.brandName.toUpperCase();
        if (aName > bName) { return 1; }
        if (aName < bName) { return -1; }
        return 0;
      });
      const brandsID = this.connectionData.brandArray.map(brand => brand.brandId);
      const OrganizationID = this.connectionData.orgTypeArray.map(org => org.typeId);
      this.orgTypes1.setValue(brandsID);
      this.orgTypes.setValue(OrganizationID);
    });

  }



  getMarketGroupIds(): void {
    this.roleMappingService.getMarketGroupIds().subscribe(data => {
      this.marketIds = data.data;
    });

  }

  getCountriesListining(): void {
    this.roleMappingService.getCountriesListining().subscribe(data => {
      this.countries = data.data;
      this.countries =  this.countries.sort((a, b) => {
        const aName = a.countryName.toUpperCase();
        const bName = b.countryName.toUpperCase();
        if (aName > bName) { return 1; }
        if (aName < bName) { return -1; }
        return 0;
      });
    });

  }

  saveRoleMapping(): void {
    if (this.brandListSelected.length > 0) {
      this.connectionData.brands = this.brandListSelected.join('');
    }
    if (this.orgTypeListSelected.length > 0 ) {
      this.connectionData.orgTypes = this.orgTypeListSelected.join('');
    }
    if ( this.connectionData.marketId) {
      const datas = {
        marketGroupId: this.connectionData.marketGroupId,
        marketListDTOList: [{
          marketId: this.connectionData.marketId,
          country: this.connectionData.country,
          active: this.activeCheck === true ? 1 : 0,
          brands: this.connectionData.brands,
          orgTypes:  this.connectionData.orgTypes
        }]
      };
      this.roleMappingService.putRoleMapping(datas).subscribe(data => {
        this.utilsService.showSuccess('Market successfully saved', '');
      });
    } else {
      const datas = {
        marketGroupId: this.connectionData.marketGroupId,
        marketListDTOList: [{
          marketId: this.connectionData.marketId,
          country: this.connectionData.country,
          active: this.activeCheck === true ? 1 : 0,
          brands: this.connectionData.brands,
          orgTypes:  this.connectionData.orgTypes
        }]
      };
      this.roleMappingService.postRoleMapping(datas).subscribe(data => {
        this.utilsService.showSuccess('Market successfully saved', '');
      });
    }
    this.dialogRef.close(true);
  }


}
