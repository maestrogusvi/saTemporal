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
import { ConnectionsRoutingModule } from './connections-routing.module';
import { ConnectionsComponent } from './connections.component';
import { S3Component } from './s3/s3.component';
import { AddEditConnectionComponent } from './add-edit-connection/add-edit-connection.component';
import { FtpComponent } from './ftp/ftp.component';
import { SoapComponent } from './soap/soap.component';

import { RestComponent } from './rest/rest.component';
import { PageHeaderModule } from '../shared/components/page-header/page-header.module';
import { OauthComponent } from './oauth/oauth.component';
import { DbClientComponent } from './db-client/db-client.component';
import { SftpComponent } from './sftp/sftp.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
@NgModule({
  declarations: [ConnectionsComponent, S3Component, AddEditConnectionComponent, FtpComponent,
    RestComponent, OauthComponent, DbClientComponent, SftpComponent, SoapComponent],
  imports: [
    CommonModule,
    ConnectionsRoutingModule,
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
    NgxTrimDirectiveModule
  ]
})
export class ConnectionsModule { }
