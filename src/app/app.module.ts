import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA , NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastrModule } from 'ngx-toastr';
import { NotifierModule } from 'angular-notifier';
import { NgxSpinnerModule } from 'ngx-spinner';

import { HttpInterceptorService } from './inteceptors/http.interceptor';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './pages/extras/page-not-found/page-not-found.component';
import { RoutesModule } from './pages/routes/routes.module';
import { LayoutModule } from './pages/layout/layout.module';
import { ThankYouComponent } from './pages/authentication/thank-you/thank-you.component';
import { MaterialModule } from './pages/shared/modules/material.module';
import { ScheduleModule } from './pages/schedule/schedule.module';
import { TenantSettingsModule } from './pages/tenant-settings/tenant-settings.module';
import { MetaJsonToTreeFormatPipe } from './core/pipe/meta-json-to-tree-format.pipe';


export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    ThankYouComponent,
    MetaJsonToTreeFormatPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RoutesModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    LayoutModule,
    MaterialModule,
    FlexLayoutModule,
    ScheduleModule,
    TenantSettingsModule,
    ToastrModule.forRoot(),
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'middle',
          distance: 12
        },
        vertical: {
          position: 'top',
          distance: 12,
          gap: 10
        }
      },
      theme: 'material',
      behaviour: {
        autoHide: 12000,
        onClick: false,
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 4
      },
      animations: {
        enabled: true,
        show: {
          preset: 'slide',
          speed: 300,
          easing: 'ease'
        },
        hide: {
          preset: 'fade',
          speed: 300,
          easing: 'ease',
          offset: 50
        },
        shift: {
          speed: 300,
          easing: 'ease'
        },
        overlap: 150
      }
    }),
    NgxSpinnerModule
  ],
  providers: [HttpClient, {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true}],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
