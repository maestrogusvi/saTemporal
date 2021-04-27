import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelComeComponent } from './welcome.component';

const routes: Routes = [
  { path: '', component: WelComeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelComeRoutingModule { }
