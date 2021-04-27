import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { HttpLoaderFactory } from './../../app.module';
import { MaterialModule } from '../shared/modules/material.module';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { CarouselModule } from './carousel/carousel.module';
import { LoginModule } from './login/login.module';
import { SignupModule } from './signup/signup.module';
import { ForgotCredentialsComponent } from './forgot-credentials/forgot-credentials.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    AuthComponent,
    ForgotCredentialsComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CarouselModule,
    LoginModule,
    SignupModule,
    AuthRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MaterialModule,
    FlexLayoutModule
  ]
})
export class AuthModule { }
