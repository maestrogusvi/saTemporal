import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { DndModule } from 'ng2-dnd';
import { HotkeyModule } from 'angular2-hotkeys';
import { MdePopoverModule } from '@material-extended/mde';
import { TreeModule } from '@circlon/angular-tree-component';
import { MaterialFileInputModule } from 'ngx-material-file-input';

import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { PropertiesPanelComponent } from './properties-panel/properties-panel.component';
import { MaterialModule } from '../shared/modules/material.module';
import { WorkflowWindowComponent } from './workflow-window/workflow-window.component';
import { WorkflowHeaderComponent } from './workflow-header/workflow-header.component';
import { WorkflowConstant } from './workflow-constant.providers';
import { WorkflowListingModule } from './workflow-listing/workflow-listing.module';
import { WorkflowRoutingModule } from './workflow-routing.module';
import { WorkflowComponent } from './workflow.component';
import { WorkflowPreviewComponent } from './workflow-preview/workflow-preview.component';
import { PageHeaderModule } from '../shared/components/page-header/page-header.module';
import { ApplicationCardModule } from '../shared/components/application-card/application-card.module';
import { AppsComponent } from './properties-panel/apps/apps.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { UploadFileComponent } from '../shared/components/upload-file/upload-file.component';
import { DragDropDirective } from '../shared/directives/drag-drop.directive';
import { MetaConnectionComponent } from './meta-connection/meta-connection.component';
import { ShowMessageDialogComponent } from './show-message-dialog/show-message-dialog.component';
import { TpSourceComponent } from './properties-panel/tp-source/tp-source.component';
import { SoapClientComponent } from './properties-panel/soap-client/soap-client.component';
import { CustomHeaderComponent } from './properties-panel/custom-header/custom-header-field';

import { TpSinkComponent } from './properties-panel/tp-sink/tp-sink.component';
import { ResizableModule } from 'angular-resizable-element';
import { MessageService } from '../shared/services/message.service';
import { HttpClientComponent } from './properties-panel/http-client/http-client.component';
import { KeyPropertiesComponent } from '../shared/components/key-properties/key-properties.component';
import { DataSlotsComponent } from './properties-panel/data-slots/data-slots.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { TemplateToSlotPipe } from 'src/app/core/pipe/template-to-slot.pipe';
import { TransformationComponent } from './properties-panel/transformation/transformation.component';
import { DataSourceTempToSlotPipe } from 'src/app/core/pipe/data-source-temp-to-slot.pipe';
import { CsvParserComponent } from './properties-panel/csv-parser/csv-parser.component';
import { CsvConverterComponent } from './properties-panel/csv-converter/csv-converter.component';
import { SqlClientComponent } from './properties-panel/sql-client/sql-client.component';
import { FixedWidthParserComponent } from './properties-panel/fixed-width-parser/fixed-width-parser.component';
import { FixedWidthDialogComponent } from './properties-panel/fixed-width-dialog/fixed-width-dialog.component';
import { CollectorComponent } from './properties-panel/collector/collector.component';
import { MetaComponent } from './meta/meta.component';
import { CloneAutomationComponent } from './clone-automation/clone-automation.component';

@NgModule({
  declarations: [
    WorkflowComponent,
    LeftSidebarComponent,
    PropertiesPanelComponent,
    WorkflowWindowComponent,
    WorkflowHeaderComponent,
    WorkflowPreviewComponent,
    AppsComponent,
    ConfirmDialogComponent,
    DragDropDirective,
    TpSourceComponent,
    SoapClientComponent,
    UploadFileComponent,
    CustomHeaderComponent,
    MetaConnectionComponent,
    ShowMessageDialogComponent,
    TpSinkComponent,
    HttpClientComponent,
    KeyPropertiesComponent,
    DataSlotsComponent,
    TemplateToSlotPipe,
    TransformationComponent,
    DataSourceTempToSlotPipe,
    CsvParserComponent,
    CsvConverterComponent,
    SqlClientComponent,
    FixedWidthParserComponent,
    FixedWidthDialogComponent,
    CollectorComponent,
    MetaComponent,
    CloneAutomationComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    WorkflowRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DndModule.forRoot(),
    WorkflowListingModule,
    PageHeaderModule,
    FlexLayoutModule,
    ApplicationCardModule,
    HotkeyModule.forRoot(),
    ResizableModule,
    MdePopoverModule,
    TreeModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    TreeModule,
    MaterialFileInputModule
  ],
  providers: [
    WorkflowConstant,
    MessageService
  ]
})
export class WorkflowModule { }
