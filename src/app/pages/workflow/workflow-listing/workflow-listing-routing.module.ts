import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkflowListingComponent } from './workflow-listing.component';


const routes: Routes = [
  {
    path: '',
    component: WorkflowListingComponent
  },
  {
    path: 'create',
    loadChildren: () => import('./../workflow.module').then(m => m.WorkflowModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./../workflow.module').then(m => m.WorkflowModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowListingRoutingModule { }
