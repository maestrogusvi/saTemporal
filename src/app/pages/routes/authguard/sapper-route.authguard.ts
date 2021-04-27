import { Router, CanActivate, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

type canActivate = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public router: Router) { }

  canActivate(): canActivate {
    if (sessionStorage.getItem('auth_token')) {
      // authorised so return true
      return true;
    }
    // navigate to login if no user logged in
    this.router.navigate(['/login']);
    return false;
  }
}

