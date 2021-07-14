import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { TableModule } from 'primeng/table';
import { MaterialModule } from '../shared/modules/material.module';
import { MarketsRoutingModule } from './markets-routing.module';
import { MarketsComponent } from './markets.component';

import { AddEditConnectionComponent } from './add-edit-connection/add-edit-connection.component';
import { PageHeaderModule } from '../shared/components/page-header/page-header.module';
import {PipesModule} from '../../pipes/pipes.module';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
@NgModule({
  declarations: [MarketsComponent, AddEditConnectionComponent],
    imports: [
        CommonModule,
        MarketsRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        MaterialModule,
        TableModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        FormsModule,
        PageHeaderModule,
        NgxMatSelectSearchModule,
        NgxTrimDirectiveModule,
        PipesModule
    ]
})
export class MarketsModule { }
