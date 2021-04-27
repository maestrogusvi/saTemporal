import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { MarketplaceRoutingModule } from './app-store-routing.module';
import { AppStoreComponent } from './app-store.component';
import { HttpLoaderFactory } from '../../app.module';
import { MaterialModule } from '../shared/modules/material.module';
import { PageHeaderModule } from '../shared/components/page-header/page-header.module';

@NgModule({
  declarations: [
    AppStoreComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MarketplaceRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    PageHeaderModule
  ]
})
export class MarketplaceModule { }
