import { Component, OnInit } from '@angular/core';
import {MarketGroupService} from '../market-groups/market-group.service';

@Component({
  selector: 'sapper-references-modal',
  templateUrl: './references-modal.component.html',
  styleUrls: ['./references-modal.component.scss']
})
export class ReferencesModalComponent implements OnInit {
  BrandsDisplayedColumns: string[] = ['b-id', 'b-name'];
  OrgDisplayedColumns: string[] = ['o-id', 'o-name'];
  brands;
  org;

  constructor(
    private marketGroupService: MarketGroupService
  ) { }

  ngOnInit(): void {
    this.marketGroupService.GetBrandsListing().subscribe(
      response => this.brands = response.data
    );
    this.marketGroupService.GetOrgTypeListing().subscribe(
      response => this.org = response.data
    );
  }

}
