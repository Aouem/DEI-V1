import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing-module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IncidentDetailExtraComponent } from '../components/incident-detail-extra/incident-detail-extra';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    NgChartsModule               // <-- Modules importés ici
  ]
})
export class AdminModule { }
