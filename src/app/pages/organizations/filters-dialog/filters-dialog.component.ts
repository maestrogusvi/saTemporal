import { Component, OnInit } from '@angular/core';
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

  constructor() {
    this.rowsFilterCount.push({Comparative: '', With: '', Filter: ''});
  }

  ngOnInit(): void {
  }

  addFilter(): void {
    this.rowsFilterCount.push({Comparative: '', With: '', Filter: ''});
  }

  save(): void {
    console.log(this.rowsFilterCount);
  }

}
