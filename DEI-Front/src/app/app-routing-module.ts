import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { IncidentFormComponent } from './components/incident-form/incident-form';
import { DashboardValidateurComponent } from './components/dashboard-validateur/dashboard-validateur';
import { ArbredecauseComponent } from './components/arbredecause/arbredecause';
import { AllSubmissionsComponent } from './components/all-submissions/all-submissions';
import { IncidentDetailExtraComponent } from './components/incident-detail-extra/incident-detail-extra';
import { AuthGuard } from './services/auth-guard';
import { RoleGuard } from './services/RoleGuard';
import { DashboardComponent } from './admin/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Dashboard principal - accessible à tous les rôles connectés
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard] // Pas de RoleGuard ici, accessible à tous
  },

  // Déclarant uniquement
  {
    path: 'incident-form',
    component: IncidentFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['DECLARANT'] }
  },

  // Dashboard validateur (spécifique)
  {
    path: 'dashboard-validateur',
    component: DashboardValidateurComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['VALIDATEUR'] }
  },

  // Routes accessibles aux validateurs
  {
    path: 'arbre-de-cause',
    component: ArbredecauseComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['VALIDATEUR'] }
  },
  {
    path: 'all-submissions',
    component: AllSubmissionsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['VALIDATEUR'] }
  },
  {
    path: 'detail-extra',
    component: IncidentDetailExtraComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['VALIDATEUR'] }
  },

  // Lazy-load admin
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule)
  },

  // Redirection par défaut
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}