// src/app/services/role-guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();
  const allowedRoles = route.data['roles'] as Array<string>;

  console.log('RoleGuard: utilisateur actuel:', currentUser);
  console.log('RoleGuard: roles autorisés pour cette route:', allowedRoles);

  // 🚫 Si pas connecté → login
  if (!currentUser) {
    console.warn('RoleGuard: utilisateur non connecté, redirection vers /login');
    return router.parseUrl('/login');
  }

  // ✅ Vérifie si le rôle est autorisé
  if (currentUser.role && allowedRoles.includes(currentUser.role)) {
    console.log('RoleGuard: accès autorisé');
    return true;
  }

  // 🚫 Rôle non autorisé → unauthorized
  console.warn('RoleGuard: accès refusé, redirection vers /unauthorized');
  return router.parseUrl('/unauthorized');
};