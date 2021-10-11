import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

import { UtilsService } from '../shared/utils.service';
import { AddEditConnectionComponent } from './add-edit-connection/add-edit-connection.component';
import { IRoleMapping } from './role-mapping.interface';
import { RoleMappingService } from './role-mapping.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ReferencesModalComponent} from '../references-modal/references-modal.component';


@Component({
  selector: 'sapper-role-mapping',
  templateUrl: './role-mapping.component.html',
  styleUrls: ['./role-mapping.component.scss']
})
export class RoleMappingComponent implements OnInit {

  pageSizeOptions = [10, 25, 50, { showAll: 'All' }];
  connectionsPerPage;
  public connectionList: IRoleMapping[] = [];
  loading = true;
  isAdmin: boolean;
  mkId;
  constructor(
    public translate: TranslateService,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute,
    private connectionService: RoleMappingService) {
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

  openOrganization(idMarketGroup: any){
    this.router.navigateByUrl('/organizations?mkId=' + idMarketGroup);
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
      this.utilsService.showSuccess('Role Mapping deleted successfully!!', '');
      this.getConnectionListing();
    });
  }

  /**
   * To get all connections
   * @returns void
   */
  getConnectionListing(): void {
    const mkg = this.mkId ? this.mkId : '';
    if (mkg != '') {
      this.connectionService.getConnectionListing(mkg).subscribe(data => {
        this.connectionList = data.data;
        this.loading = false;
      });
    }else{
      this.connectionService.getConnectionListing(mkg).subscribe(data => {
        this.connectionList = data.data;
        this.loading = false;
      });
    }

  }

  separateString(myString: any) {
    var output = [];
    var letters = 1;
    var i = 0;

    while(i < myString.length){
      // console.log(i);
      var initIndex = i;
      var endIndex = i + letters;
      output.push(myString.substring(initIndex, endIndex));
      i = endIndex;
    }
    return output.join(',');
  }

  referencesModalComponent(): void {
    this.dialog.open(ReferencesModalComponent, { data: {}, width: '1000px' });
  }
}
