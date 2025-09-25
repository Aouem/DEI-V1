// src/app/components/dashbord-declarant/dashbord-declarant.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { IncidentService } from '../../services/incident';
import { Incident } from '../../../interfaces/incident';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashbord-declarant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashbord-declarant.html',
  styleUrls: ['./dashbord-declarant.css']
})
export class DashbordDeclarantComponent implements OnInit {
  currentUser: any;

  todayIncidentCount = 0;
  severityCount: { [key: number]: number } = {}; // ⚠️ Définition obligatoire

  constructor(
    private authService: AuthService,
    private router: Router,
    private incidentService: IncidentService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTodayIncidents();
  }

  // 🔹 Navigation vers le formulaire
  navigateToIncidentForm(): void {
    this.router.navigate(['/incident-form']);
  }

  // 🔹 Déconnexion
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // 🔹 Retourne les incidents d’aujourd’hui et comptage par gravité
  loadTodayIncidents(): void {
    this.incidentService.getIncidents().subscribe((incidents: Incident[]) => {
      const today = new Date();
      today.setHours(0,0,0,0);

      const todayIncidents = incidents.filter(i => {
        const date = new Date(i['dateSurvenue']);
        date.setHours(0,0,0,0);
        return date.getTime() === today.getTime();
      });

      this.todayIncidentCount = todayIncidents.length;

      this.severityCount = {};
      todayIncidents.forEach(i => {
        const g = i['gravite'] ?? 0;
        this.severityCount[g] = (this.severityCount[g] || 0) + 1;
      });
    });
  }

  // 🔹 Clés de gravité pour *ngFor
  severityKeys(): number[] {
    return Object.keys(this.severityCount).map(k => Number(k)).sort();
  }

  // 🔹 Classe CSS selon le nombre d’incidents
  getIncidentClass(count: number): string {
    if (count === 0) return 'zero';
    if (count <= 2) return 'low';
    if (count <= 5) return 'medium';
    return 'high';
  }

  // 🔹 Couleur selon gravité
  getSeverityColor(severity: number): string {
    switch(severity) {
      case 1: return '#4caf50';
      case 2: return '#ffeb3b';
      case 3: return '#ff9800';
      case 4: return '#f44336';
      case 5: return '#9c27b0';
      default: return '#757575';
    }
  }
}
