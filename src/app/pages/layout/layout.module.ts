import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';
import { RoutesModule } from '../routes/routes.module';
import { MccColorPickerModule } from 'material-community-components';
import { MaterialModule } from '../shared/modules/material.module';
import { FooterComponent } from './footer/footer.component';
import { ChatbotComponent } from './../chatbot/chatbot.component';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    ChatbotComponent
  ],
  imports: [
    CommonModule,
    RoutesModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FlexLayoutModule,
    ReactiveFormsModule,
    MccColorPickerModule,
    MaterialModule,
    FormsModule,
    NgxTrimDirectiveModule
  ],
  exports: []
})
export class LayoutModule { }
