import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

import { UtilsService } from '../shared/utils.service';
import { AddEditConnectionComponent } from './add-edit-connection/add-edit-connection.component';
import { IMarket } from './market.interface';
import { MarketsService } from './markets.service';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'sapper-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss']
})
export class MarketsComponent implements OnInit {

  pageSizeOptions = [10, 25, 50, { showAll: 'All' }];
  connectionsPerPage;
  public connectionList: IMarket[] = [];
  loading = true;
  isAdmin: boolean;
  mkId;
  constructor(
    public translate: TranslateService,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute,
    private connectionService: MarketsService) {
    translate.addLangs(utilsService.getLangList());
    translate.use(utilsService.getDefaultLang());
    this.isAdmin = this.utilsService.getItemFromSessionStorage('atk11') === 'true';
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      this.mkId = queryParams.get('mkId');
    });
    this.getConnectionListing();
  }

  openPopUp(connectionData) {
    const connectionDataCopy = Object.assign({}, connectionData);
    const dialogRef = this.dialog.open(AddEditConnectionComponent, { data: connectionDataCopy, width: '800px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getConnectionListing();
      }
    });
  }


  /**
   * Open dialog to create connection
   */
  openCreateConnectionDialog(): void {
    const dialogRef = this.dialog.open(AddEditConnectionComponent, { data: {}, width: '800px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getConnectionListing();
      }
    });
  }

  /**
   * To delete connection
   * @param id: string
   */
  deleteConnection(id: string): void {
    this.connectionService.deleteRoleMapping(id).subscribe(data => {
      this.utilsService.showSuccess('Market deleted successfully!!', '');
      this.getConnectionListing();
    });
  }

  /**
   * To get all connections
   * @returns void
   */
  getConnectionListing(): void {
    const mkg = this.mkId ? this.mkId : '';
    this.connectionService.getConnectionListing(mkg).subscribe(data => {
      this.connectionList = data.data;
      this.loading = false;
    });
  }
}
