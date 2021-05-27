import { Component, OnInit } from '@angular/core';
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

  save(): void {
    console.log(this.rowsFilterCount);
    let url = '' ;
    for (const row of this.rowsFilterCount) {
      if(row.Filter === 'active'){
        if(row.With.toLowerCase() === 'active'){
          url = url + row.Filter + ':' + row.Comparative + ':1:AND,';
        }else{
          url = url + row.Filter + ':' + row.Comparative + ':0:AND,';
        }

      }else{
        url = url + row.Filter + ':' + row.Comparative + ':' + row.With + ':AND,';
      }

    }
    this.connectionService.getOrganizationsBySearch(url).subscribe(data => {
      this.connectionList = data.data;
      this.loading = false;
      this.dialogRef.close({data: this.connectionList});
    });

  }

}
