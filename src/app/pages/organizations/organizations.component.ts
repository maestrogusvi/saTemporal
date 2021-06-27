import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

import { UtilsService } from '../shared/utils.service';
import { AddEditConnectionComponent } from './add-edit-connection/add-edit-connection.component';
import { IOrganization } from './organizations.interface';
import { OrganizationsService } from './organizations.service';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {FiltersDialogComponent} from './filters-dialog/filters-dialog.component';
@Component({
  selector: 'sapper-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss']
})
export class OrganizationsComponent implements OnInit {

  pageSizeOptions = [10, 25, 50, 100];
  rowsPerPage = 10;
  page = 0;
  totalRecords = 3000;
  connectionsPerPage;
  public connectionList: IOrganization[] = [];
  loading = true;
   mkId;

  constructor(
    public translate: TranslateService,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute,
    private connectionService: OrganizationsService) {
    translate.addLangs(utilsService.getLangList());
    translate.use(utilsService.getDefaultLang());
  }

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(queryParams => {
      this.mkId = queryParams.get('mkId');
    });
    this.getConnectionListing();
  }
  openFilterDialog() {
    const dialogRef = this.dialog.open(FiltersDialogComponent);
    dialogRef.componentInstance.rowPerPage = this.rowsPerPage;
    dialogRef.componentInstance.page = this.page;

    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        this.connectionList = result.data;
      }

    });
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
  openCreateConnectionDialog(datas: any): void {
    if (this.dialog.openDialogs.length == 0) {
      const dialogRef = this.dialog.open(AddEditConnectionComponent, { data: datas, width: '800px' });
    }
  }

  rowClick( data: IOrganization) {
    // and do some other stuff...
    this.openCreateConnectionDialog(data);
  }

  loadCustomers(event: any): void {
    console.log(event);
    this.rowsPerPage = event.rows;
    this.page = (event.first / event.rows);
    this.getConnectionListing();
  }

  /**
   * To get all connections
   * @returns void
   */
  getConnectionListing(): void {
    const mkg = this.mkId ? this.mkId : '';
    // tslint:disable-next-line:triple-equals
    if ( mkg != '') {
      this.connectionService.getOrganizationByMgListing(mkg, this.rowsPerPage, this.page).subscribe(data => {
        this.connectionList = data.data;
        this.loading = false;
        console.log(this.connectionList);
      });
    } else {
      this.connectionService.getOrganizations().subscribe(data => {
        this.connectionList = data.data;
        this.loading = false;
        console.log(this.connectionList);
      });
    }

    this.loading = false;
  }
  changeActiveOrganization(idOrganization: any, active: any): void {
    this.connectionService.putOrganizationActive(idOrganization, active).subscribe(data => {
      this.loading = false;
      this.getConnectionListing();
    });
    this.loading = false;
  }

  separateString(myString: any) {
    const newString = myString.split(',');
    return newString;
}
}
