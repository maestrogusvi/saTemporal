import {Component, Input, OnInit} from '@angular/core';
import {OrganizationsService} from '../organizations.service';
import {IOrganization} from '../organizations.interface';
import {MatDialogRef} from '@angular/material/dialog';
interface Filter {
  Filter: any;
  Comparative: any;
  With: any;
}

@Component({
  selector: 'sapper-filters-dialog',
  templateUrl: './filters-dialog.component.html',
  styleUrls: ['./filters-dialog.component.scss']
})
export class FiltersDialogComponent implements OnInit {

  @Input() public rowPerPage;
  @Input() public page;
  rowsFilterCount: Filter[] = [];
  public connectionList: IOrganization[] = [];
  loading = true;

  constructor(private connectionService: OrganizationsService,
              public dialogRef: MatDialogRef<FiltersDialogComponent>,
              ) {
    this.rowsFilterCount.push({Comparative: '', With: '', Filter: ''});
  }

  ngOnInit(): void {
  }

  addFilter(): void {
    this.rowsFilterCount.push({Comparative: '', With: '', Filter: ''});
  }

  async save(): Promise<void> {
    let url = '';
    for (const row of this.rowsFilterCount) {
      if (row.Filter === 'active') {
        if (row.With.toLowerCase() === 'active') {
          url = url + row.Filter + ':' + row.Comparative + ':1:AND,';
        } else {
          url = url + row.Filter + ':' + row.Comparative + ':0:AND,';
        }

      } else {
        url = url + row.Filter + ':' + row.Comparative + ':' + row.With + ':AND,';
      }

    }
    const data = await this.connectionService.getOrganizationsBySearch(url, this.rowPerPage, this.page).toPromise();
    this.connectionList = data.data;
    this.loading = false;
    this.dialogRef.close({data: data.data});

  }

}
