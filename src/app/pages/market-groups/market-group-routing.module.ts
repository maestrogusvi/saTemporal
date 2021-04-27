import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketGroupComponent } from './market-group.component';

const routes: Routes = [
  { path: '', component: MarketGroupComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketGroupRoutingModule { }
