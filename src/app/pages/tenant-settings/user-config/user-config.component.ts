import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserConfigService } from './user-config.service';
import { UtilsService } from '../../shared/utils.service';
import { UserData } from './user-config.interface';


@Component({
  selector: 'sapper-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'inactive-active'];
  dataSource: MatTableDataSource<UserData>;
  tenantName: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public userConfigService: UserConfigService,
    public utilService: UtilsService) {
    this.tenantName = this.utilService.getItemFromSessionStorage('tenant_name');
  }

  ngOnInit() {
    this.getUsers();
  }

  /**
   * Used to get users by tenant name
   * @returns void
   */
  private getUsers(): void {
    this.userConfigService.getUsersByTenantName(this.tenantName).subscribe((users) => {
      let usersList = this.utilService.fetchResponseData(users);
      if (usersList) {
        usersList = usersList.filter((element) =>
          element.authorities.some((auth) => auth.id !== 'ROLE_ADMIN'));
        this.dataSource = new MatTableDataSource(usersList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  /**
   * Used to filter user table
   * @param  {Event} event
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Used to update user
   * @param  any user
   * @returns void
   */
  updateUser(user): void {
    user.enabled = !user.enabled;
    this.userConfigService.updateUsersByTenantName(user).subscribe(() => {
      this.utilService.showSuccess('User activation status updated successfully.', '');
      this.getUsers();
    });
  }
}
