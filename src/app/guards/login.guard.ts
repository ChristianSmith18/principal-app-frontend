import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService, User } from './../services/login.service';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private _login: LoginService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    try {
      const user: User = JSON.parse(atob(localStorage.getItem('idrt'))).user;
      return fetch(`${environment.apiUrl}/user/one?id=${user.rut}`)
        .then(async (resp) => {
          const validateUser: { ok: boolean; user: User } = await resp.json();
          if (validateUser.ok) {
            this.router.navigate(['tabs']);
            return false;
          }
          return true;
        })
        .catch((_) => true);
    } catch {
      return true;
    }
  }
}
