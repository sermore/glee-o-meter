import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role, User } from './models/user';
import { AuthenticationService } from './services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authentication: AuthenticationService, private router: Router) {
    console.log('init guard');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log(`canActivate '${route.url}'`);
    return this.canActivateRoute(route, state);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log(`canActivate child '${childRoute.url}'`);
    return this.canActivateRoute(childRoute, state);
  }

  private canActivateRoute(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authentication.loggedUser$.pipe(
      map(loggedUser => {
        const res = this.checkRoute(route, state, loggedUser);
        console.log(`can activate route '${state.url}' '${route.url}' ${res}`);
        return res;
      })
    );
  }

  private checkRoute(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, user: User): boolean {
    if ((!route.data.roles && user)
      || (route.data.roles && !user)
      || (user && route.data.roles && !route.data.roles.includes(user.role)) || state.url === '/') {
      if (user) {
        if (user.role === Role.USER_MANAGER) {
          this.router.navigate(['/admin/users']);
        } else {
          this.router.navigate(['/glee']);
        }
      } else {
        this.router.navigate(['/login']);
      }
      return false;
    }
    return true;
  }
}
