import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { SignupComponent } from './signup.component';
import { SignupService } from './signup.service';
import { HttpLoaderFactory } from './../../../app.module';
import { MaterialModule } from '../../shared/modules/material.module';

@NgModule({
  declarations: [SignupComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [SignupComponent],
  providers: [SignupService]
})
export class SignupModule { }
