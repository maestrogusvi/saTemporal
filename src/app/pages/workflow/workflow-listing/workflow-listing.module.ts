import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { WorkflowListingComponent } from './workflow-listing.component';
import { WorkflowListingRoutingModule } from './workflow-listing-routing.module';
import { MaterialModule } from '../../shared/modules/material.module';
import { WorkflowCardModule } from '../../shared/components/workflow-card/workflow-card.module';
import { PageHeaderModule } from '../../shared/components/page-header/page-header.module';
import { WorkflowDetailsDialogComponent } from './workflow-details-dialog/workflow-details-dialog.component';
import { MessageService } from '../../shared/services/message.service';

@NgModule({
  declarations: [
    WorkflowListingComponent,
    WorkflowDetailsDialogComponent,
  ],
  imports: [
    CommonModule,
    WorkflowListingRoutingModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    WorkflowCardModule,
    PageHeaderModule
  ],
  providers: [ MessageService ]
})
export class WorkflowListingModule { }
