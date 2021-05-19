import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

import { AuthGuard } from './authguard/sapper-route.authguard';

import { PageNotFoundComponent } from '../extras/page-not-found/page-not-found.component';
import { LayoutComponent } from '../layout/layout.component';
import { ThankYouComponent } from '../authentication/thank-you/thank-you.component';
import { ForgotCredentialsComponent } from '../authentication/forgot-credentials/forgot-credentials.component';
import { ResetPasswordComponent } from '../authentication/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
      {
        path: 'welcome', loadChildren: () => import('../welcome/welcome.module').then(m => m.WelComeModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'markets-groups',
        loadChildren: () => import('../market-groups/market-group.module').then(m => m.MarketGroupModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'role-mapping',
        loadChildren: () => import('../role-mapping/role-mapping.module').then(m => m.RoleMappingModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'organizations',
        loadChildren: () => import('../organizations/organizations.module').then(m => m.OrganizationsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'markets',
        loadChildren: () => import('../markets/markets.module').then(m => m.MarketsModule),
        canActivate: [AuthGuard]
      },
    ]
  },
  { path: 'login', loadChildren: () => import('../authentication/auth.module').then(m => m.AuthModule) },
  { path: 'signup', loadChildren: () => import('../authentication/auth.module').then(m => m.AuthModule) },
  { path: 'thank-you', component: ThankYouComponent },
  { path: 'forgot-password', component: ForgotCredentialsComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'change-password', component: ResetPasswordComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      useHash: true
    }),
  ],
  providers: [AuthGuard],
  exports: [RouterModule]
})
export class RoutesModule { }
