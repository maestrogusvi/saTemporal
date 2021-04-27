import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TreeModule } from '@circlon/angular-tree-component';
import { MentionModule } from 'angular-mentions';

import { MappingComponent } from './mapping.component';
import { MappingRoutingModule } from './mapping-routing.module';
import { MaterialModule } from '../shared/modules/material.module';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

@NgModule({
  declarations: [MappingComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TreeModule,
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    MappingRoutingModule,
    MentionModule,
    CodemirrorModule
  ]
})
export class MappingModule { }
