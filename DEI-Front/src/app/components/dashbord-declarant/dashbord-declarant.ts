import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IncidentService } from '../../services/incident';
import { AuthService } from '../../services/auth-service';
import { Incident, StatutDeclaration, StatutDeclarationLabels, GraviteEvenement, GraviteEvenementLabels } from '../../../interfaces/incident';

@Component({
  selector: 'app-dashbord-declarant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashbord-declarant.html',
  styleUrls: ['./dashbord-declarant.css']
})
export class DashbordDeclarantComponent implements OnInit {

  currentUserId: string = '';
  incidents: Incident[] = [];

  // Comptage par statut
  pendingCount = 0;
  brouillonCount = 0;
  resolvedCount = 0;

  constructor(
    private authService: AuthService,
    private incidentService: IncidentService,
    private router: Router,
      private location: Location // ← ajout

  ) {}

  ngOnInit(): void {
    // 🔹 Récupération de l'utilisateur connecté depuis le token
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUserId = user.id;
    }

    // 🔹 Charger les incidents déclarés par cet utilisateur
    this.incidentService.getIncidents().subscribe((incidents: Incident[]) => {
      // Filtrer uniquement les incidents du déclarant connecté
      this.incidents = incidents.filter(i => i.declarantId === this.currentUserId);

      // Calcul des stats
      this.calculerStats();
    });
  }

  calculerStats(): void {
    this.pendingCount = 0;
    this.brouillonCount = 0;
    this.resolvedCount = 0;

    this.incidents.forEach(incident => {
      switch (incident.statut) {
        case StatutDeclaration.Soumis:
          this.pendingCount++;
          break;
        case StatutDeclaration.Brouillon:
          this.brouillonCount++;
          break;
        case StatutDeclaration.Resolu:
        case StatutDeclaration.Cloture:
          this.resolvedCount++;
          break;
        default:
          break;
      }
    });
  }

  // 🔹 Navigation
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // 🔹 Couleur selon gravité (optionnel)
  getSeverityColor(severity: GraviteEvenement | undefined): string {
    switch(severity) {
      case GraviteEvenement.Benin: return '#4caf50';
      case GraviteEvenement.PeuGrave: return '#ffeb3b';
      case GraviteEvenement.Moyenne: return '#ff9800';
      case GraviteEvenement.Grave: return '#f44336';
      case GraviteEvenement.TresGrave: return '#9c27b0';
      case GraviteEvenement.Catastrophique: return '#000000';
      default: return '#757575';
    }
  }

  // 🔹 Libellé du statut
  getStatutLabel(statut: StatutDeclaration): string {
    return StatutDeclarationLabels[statut] || 'Inconnu';
  }

goBack(): void {
  window.history.back();
}


}
