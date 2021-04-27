import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunityWorkflowComponent } from './community-workflow.component';


const routes: Routes = [
  {
    path: '',
    component: CommunityWorkflowComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityWorkflowRoutingModule { }
