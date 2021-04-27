import { NgModule } from '@angular/core';
// import { UtilsService } from './utils.service';

import { MaterialModule } from './modules/material.module';
import { WorkflowCardComponent } from './components/workflow-card/workflow-card.component';
import { WorkflowCardModule } from './components/workflow-card/workflow-card.module';

@NgModule({
  declarations: [
    // WorkflowCardComponent
  ],
  imports: [
    MaterialModule,
    WorkflowCardModule
  ],
  // providers: [UtilsService],
  exports: [
   // UtilsService,
    MaterialModule,
    // WorkflowCardComponent
    WorkflowCardModule
  ]
})
export class SharedModule {}
