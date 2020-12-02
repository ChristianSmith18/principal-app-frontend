import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService, User } from '@services/login.service';
import { environment } from '@src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LogoutGuard implements CanActivate {
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
            return true;
          }
          this.router.navigate(['login']);
          return false;
        })
        .catch(() => {
          localStorage.removeItem('idrt');
          this.router.navigate(['login']);
          return false;
        });
    } catch {
      this.router.navigate(['login']);
      return false;
    }
  }
}
