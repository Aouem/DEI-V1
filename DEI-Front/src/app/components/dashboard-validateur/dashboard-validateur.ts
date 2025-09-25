import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { IncidentService } from '../../services/incident';
import { Incident } from '../../../interfaces/incident';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-validateur',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-validateur.html',
  styleUrls: ['./dashboard-validateur.css']
})
export class DashboardValidateurComponent implements OnInit {
  currentUser: any;
  isAdmin = false;
  isValidateur = false;

  todayIncidentCount = 0;
  severityCount: { [key: number]: number } = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private incidentService: IncidentService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.currentUser?.role === 'ADMIN';
    this.isValidateur = this.currentUser?.role === 'VALIDATEUR';

    this.loadTodayIncidents();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // 🔹 Calcul des incidents d'aujourd'hui et de leurs gravités
  loadTodayIncidents(): void {
    this.incidentService.getIncidents().subscribe((incidents: Incident[]) => {
      const today = new Date();
      today.setHours(0,0,0,0);

      const todayIncidents = incidents.filter(i => {
        const incidentDate = new Date(i.dateSurvenue);
        incidentDate.setHours(0,0,0,0);
        return incidentDate.getTime() === today.getTime();
      });

      // Total d'incidents
      this.todayIncidentCount = todayIncidents.length;

      // Comptage par gravité
      this.severityCount = {};
      todayIncidents.forEach(i => {
        const g = i.gravite ?? 0;
        this.severityCount[g] = (this.severityCount[g] || 0) + 1;
      });
    });
  }

  // 🔹 Retourne les clés de gravité pour *ngFor
  severityKeys(): number[] {
    return Object.keys(this.severityCount).map(k => Number(k)).sort();
  }

  // 🔹 Retourne une couleur selon le niveau de gravité
  getSeverityColor(severity: number): string {
    switch(severity) {
      case 1: return '#4caf50';  // vert
      case 2: return '#ffeb3b';  // jaune clair
      case 3: return '#ff9800';  // orange
      case 4: return '#f44336';  // rouge
      case 5: return '#9c27b0';  // violet
      default: return '#757575'; // gris
    }
  }

  // 🔹 Retourne une classe CSS selon le nombre d'incidents
  getIncidentClass(count: number): string {
    if (count === 0) return 'zero';
    if (count <= 2) return 'low';
    if (count <= 5) return 'medium';
    return 'high';
  }
  navigateToIncidentForm(): void {
  this.router.navigate(['/incident-form']);
}

}