import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MarketGroupService } from '../market-group.service';
import { UtilsService } from '../../shared/utils.service';
import { IMarket } from '../market.interface';


@Component({
  selector: 'sapper-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit {

  connectionForm: FormGroup;
  connectionTypeControl: FormControl;
  @ViewChild('addEditConnection') addEditConnection: TemplateRef<any>;
  @ViewChild('restConnection') restConnection;
  connectionType = [{
    key: 'S3',
    value: 'S3'
  }];
  searchApp;
  pageSizeOptions = [10, 25, 50, { showAll: 'All' }];
  marketsData: IMarket[] = [];
  mkgId: any;
  public enableBtnSave = false;
  loading = false;
  constructor(
    public dialogRef: MatDialogRef<MarketComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private utilsService: UtilsService,
    private connectionService: MarketGroupService) {

    this.mkgId = data;
  }

  ngOnInit(): void {
    this.getMarketsByMkGp();
    this.createForm();
  }
  /**
   * This function is used for define the structure of connction form.
   */
  createForm() {
    this.connectionForm = new FormGroup({
    });
  }

  getMarketsByMkGp(): void {
    this.connectionService.getMarketsByMg(this.mkgId).subscribe(data => {
      this.marketsData = data.data;
      this.loading = false;
    });
    this.loading = false;
  }


}
