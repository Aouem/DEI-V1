// src/app/admin/admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QuestionsListComponent } from '../components/questions-list-component/questions-list-component';
import { AllSubmissionsComponent } from '../components/all-submissions/all-submissions';
import { ConfirmationComponent } from '../components/confirmation/confirmation';
import { IncidentListComponent } from '../components/incident-list/incident-list';
import { EvenementDetailComponent } from '../components/evenement-detail/evenement-detail';
import { UserForm } from '../components/user-form/user-form';
import { UserList } from '../components/user-list/user-list';
import { ServicesComponent } from '../components/services/services';
import { ArbredecauseComponent } from '../components/arbredecause/arbredecause';
import { IncidentDetailExtraComponent } from '../components/incident-detail-extra/incident-detail-extra';
import { RoleGuard } from '../services/RoleGuard';
import { IncidentFormComponent } from '../components/incident-form/incident-form';

const routes: Routes = [
  // Dashboard Admin
  { path: '', component: DashboardComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } },

  // Admin seulement
  { path: 'questions', component: QuestionsListComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } },
  { path: 'confirmation', component: ConfirmationComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } },
  { path: 'incidents-list', component: IncidentListComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } },
    { path: 'incident-form', component: IncidentFormComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } },
{ path: 'incident-form/:id', component: IncidentFormComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } },

  { path: 'services', component: ServicesComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } },
  { path: 'utilisateurs', component: UserList, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } },
  { path: 'user-form', component: UserForm, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } },
  { path: 'user-form/:id', component: UserForm, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } },
  { path: 'evenement/:id', component: EvenementDetailComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } },

  // Admin + Validateur (si jamais tu veux que validateur voit certains composants)
    { path: 'evenement-detail', component: EvenementDetailComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'VALIDATEUR'] } },
  { path: 'all-submissions', component: AllSubmissionsComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'VALIDATEUR'] } },
    { path: 'confirmation/:id', component: ConfirmationComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'VALIDATEUR'] } },
  { path: 'arbre-de-cause', component: ArbredecauseComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'VALIDATEUR'] } },
  { path: 'detail-extra', component: IncidentDetailExtraComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'VALIDATEUR'] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}