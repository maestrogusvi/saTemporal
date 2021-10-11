import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

import { UtilsService } from '../shared/utils.service';
import { AddEditConnectionComponent } from './add-edit-connection/add-edit-connection.component';
import { IMarketGroup } from './market-group.interface';
import { MarketGroupService } from './market-group.service';
import {Router} from '@angular/router';
import {MarketComponent} from './market/market.component';
import {ReferencesModalComponent} from '../references-modal/references-modal.component';

@Component({
  selector: 'sapper-market-group',
  templateUrl: './market-group.component.html',
  styleUrls: ['./market-group.component.scss']
})
export class MarketGroupComponent implements OnInit {

  pageSizeOptions = [10, 25, 50, { showAll: 'All' }];
  connectionsPerPage;
  public connectionList: IMarketGroup[] = [];
  loading = true;
  isAdmin: boolean;
  constructor(
    public translate: TranslateService,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    public router: Router,
    private connectionService: MarketGroupService) {
    translate.addLangs(utilsService.getLangList());
    translate.use(utilsService.getDefaultLang());
    this.isAdmin = this.utilsService.getItemFromSessionStorage('atk11') === 'true';
  }

  ngOnInit(): void {
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

  openOrganization(idMarketGroup: any) {
    this.router.navigateByUrl('/organizations?mkId=' + idMarketGroup);
  }
  openMarkets(idMarketGroup: any) {
    this.router.navigateByUrl('/markets?mkId=' + idMarketGroup);
  }

  openRoleMapping(idMarketGroup: any) {
    this.router.navigateByUrl('/role-mapping?mkId=' + idMarketGroup);
  }

  /**
   * Open dialog to create connection
   */
  openCreateConnectionDialog(): void {
    const dialogRef = this.dialog.open(AddEditConnectionComponent, { data: {}, width: '1000px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getConnectionListing();
      }
    });
  }

  referencesModalComponent(): void {
    this.dialog.open(ReferencesModalComponent, { data: {}, width: '1000px' });
}

  /**
   * To delete connection
   * @param id: string
   */
  deleteConnection(id: string): void {
   this.connectionService.deleteMarketGroup(id).subscribe(data => {
      this.connectionList = data.data;
      this.loading = false;
    });
  }

  /**
   * To get all connections
   * @returns void
   */
  getConnectionListing(): void {
    this.connectionService.getConnectionListing().subscribe(data => {
      this.connectionList = data.data;
      this.loading = false;
    });
    this.loading = false;
  }

  separateString(myString: any) {
    let output = [];
    let letters = 1;
    let i = 0;

    while (i < myString.length){

      let initIndex = i;
      let endIndex = i + letters;
      output.push(myString.substring(initIndex, endIndex));
      i = endIndex;
    }
    return output.join(',');
  }
}
