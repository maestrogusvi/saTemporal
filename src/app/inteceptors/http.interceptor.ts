import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';

import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { UtilsService } from './../pages/shared/utils.service';
import { LoginService } from './../pages/authentication/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  private readonly notifier: NotifierService;
  private spinnerCounter = 0;

  constructor(
    public auth: LoginService,
    private utilService: UtilsService,
    public router: Router,
    notifierService: NotifierService,
    private spinner: NgxSpinnerService) {
    this.notifier = notifierService;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.utilService.getItemFromSessionStorage('auth_token');
    // const contentType = this.utilService.getContentType(request.url);
    const contentType = 'application/json';
    if (accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }
    if (contentType) {
      request = request.clone({
        setHeaders: {
          'content-type': contentType
        }
      });
    }
    this.showSpinner();
    // if (accessToken) {
    //   request = request.clone({
    //     setHeaders: {
    //       'Authorization': `Bearer ${accessToken}`,
    //       //'content-type': 'application/json'
    //     }
    //   });
    // }
    return next.handle(request).pipe(
      tap((ev: HttpEvent<any>) => {
        if (ev['status'] && (ev['status'] === 200 || ev['status'] === 201)) {
          this.hideSpinner();
        }
      }),
      // Global error handling
      catchError((error: HttpErrorResponse) => {
        // return an observable
        this.hideSpinner();
        if (error.status === 401 || error.status === 403) {
          // auto logout if 401 response returned from api
          sessionStorage.clear();
          this.router.navigate(['/login']);
          return;
        }
        if (error.status === 500) {
          this.notifier.notify('error', 'Unable to perform requested action.');
          return;
        }
        if (error && error.error) {
          this.notifier.notify('error', error.error.errorMessage);
        }
        return throwError(`Error Code: ${error.status}\nError Message: ${error.message}`);
      })
    );
  }

  showSpinner() {
    if (this.spinnerCounter === 0) {
      this.spinner.show();
    }
    this.spinnerCounter = this.spinnerCounter + 1;
  }

  hideSpinner() {
    this.spinnerCounter = this.spinnerCounter - 1;
    if (this.spinnerCounter === 0) {
      this.spinner.hide();
    }
  }
}
