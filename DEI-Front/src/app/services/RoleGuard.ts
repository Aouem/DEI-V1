import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth-service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const currentUser = this.authService.getCurrentUser();
    const allowedRoles = route.data['roles'] as Array<string>;

    // 🚫 Si pas connecté → login
    if (!currentUser) {
      return this.router.parseUrl('/login');
    }

    // ✅ Si l’utilisateur a un rôle valide
    if (currentUser.role && allowedRoles.includes(currentUser.role)) {
      return true;
    }

    // 🚫 Si connecté mais pas autorisé → unauthorized
    return this.router.parseUrl('/unauthorized');
  }
}