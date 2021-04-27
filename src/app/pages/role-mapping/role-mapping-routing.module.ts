import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleMappingComponent } from './role-mapping.component';

const routes: Routes = [
  { path: '', component: RoleMappingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleMappingRoutingModule { }
