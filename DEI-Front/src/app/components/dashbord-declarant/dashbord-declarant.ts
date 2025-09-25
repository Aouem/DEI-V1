import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  severityCount: { [key: number]: number } = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private incidentService: IncidentService,
    private cdr: ChangeDetectorRef // 🔹 Ajout du cdr
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTodayIncidents();
  }

  navigateToIncidentForm(): void {
    this.router.navigate(['/incident-form']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadTodayIncidents(): void {
    this.incidentService.getIncidents().subscribe((incidents: Incident[]) => {
      if (!incidents || incidents.length === 0) {
        this.todayIncidentCount = 0;
        this.severityCount = {};
        this.cdr.detectChanges(); // 🔹 Forcer la détection après mise à jour
        return;
      }

      const today = new Date();
      today.setHours(0,0,0,0);

      const todayIncidents = incidents.filter(i => {
        if (i.declarantId !== this.currentUser?.id) return false;
        const date = new Date(i.dateSurvenue);
        return date.getFullYear() === today.getFullYear() &&
               date.getMonth() === today.getMonth() &&
               date.getDate() === today.getDate();
      });

      this.todayIncidentCount = todayIncidents.length;

      this.severityCount = {};
      todayIncidents.forEach(i => {
        const g = i.gravite ?? 0;
        this.severityCount[g] = (this.severityCount[g] || 0) + 1;
      });

      this.cdr.detectChanges(); // 🔹 Forcer la mise à jour de l'affichage

      console.log("Incidents d'aujourd'hui :", todayIncidents);
      console.log("Comptage par gravité :", this.severityCount);
    });
  }

  severityKeys(): number[] {
    return Object.keys(this.severityCount).map(k => Number(k)).sort();
  }

  getIncidentClass(count: number): string {
    if (count === 0) return 'zero';
    if (count <= 2) return 'low';
    if (count <= 5) return 'medium';
    return 'high';
  }

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
