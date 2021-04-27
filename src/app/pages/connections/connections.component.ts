import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

import { UtilsService } from './../shared/utils.service';
import { AddEditConnectionComponent } from './add-edit-connection/add-edit-connection.component';
import { IConnections } from './connections.interface';
import { ConnectionService } from './connection.service';

@Component({
  selector: 'sapper-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.scss']
})
export class ConnectionsComponent implements OnInit {

  pageSizeOptions = [10, 25, 50, { showAll: 'All' }];
  connectionsPerPage;
  public connectionList: IConnections[] = [];
  loading = true;

  constructor(
    public translate: TranslateService,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    private connectionService: ConnectionService) {
    translate.addLangs(utilsService.getLangList());
    translate.use(utilsService.getDefaultLang());
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
    this.connectionService.deleteConnection(id).subscribe(data => {
      this.utilsService.showSuccess('Connection deleted successfully!!', '');
      this.getConnectionListing();
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
  }
}
