import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    return this.authService.authInfo$.pipe(
      // Use take(1) (or first()) because the observable must complete
      map(authInfo => authInfo.isLoggedIn()), take(1), tap(allowed => {
        if (!allowed) {
          this.router.navigate(['/login']);
        }
      }));
  }
}
