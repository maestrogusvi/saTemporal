import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CommunityWorkflowComponent } from './community-workflow.component';
import { CommunityWorkflowRoutingModule } from './community-workflow-routing.module';
import { MaterialModule } from '../shared/modules/material.module';
import { WorkflowCardModule } from '../shared/components/workflow-card/workflow-card.module';
import { PageHeaderModule } from '../shared/components/page-header/page-header.module';

@NgModule({
  declarations: [CommunityWorkflowComponent],
  imports: [
    CommonModule,
    CommunityWorkflowRoutingModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
    WorkflowCardModule,
    PageHeaderModule
  ]
})
export class CommunityWorkflowModule { }
