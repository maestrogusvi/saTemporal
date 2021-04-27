import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './sapper-route.authguard';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    guard = TestBed.inject(AuthGuard);
  });

  // it('should return true for a logged in user', () => {
  // });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true for a logged in user', () => {
    expect(guard.canActivate()).toEqual(false);
    const authToken = sessionStorage.setItem('auth_token', 'sessionvariable');
    router = TestBed.inject(Router);
    guard = new AuthGuard(router);
    expect(guard.canActivate()).toEqual(true);
  });

  it('should navigate to home for a logged out user', () => {
    const authToken = sessionStorage.setItem('auth_token', '');
    router = TestBed.inject(Router);
    guard = new AuthGuard(router);

    spyOn(router, 'navigate');
    expect(guard.canActivate()).toEqual(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
