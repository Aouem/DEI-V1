import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IncidentService } from '../../services/incident';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { getGraviteLabel, GraviteEvenement } from '../../../interfaces/GraviteEvenement';
import { Incident, StatutDeclaration } from '../../../interfaces/incident';
import 'animate.css';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './incident-list.html',
  styleUrls: ['./incident-list.css']
})
export class IncidentListComponent implements OnInit {
  incidents: Incident[] = [];
  filteredIncidents: Incident[] = [];
  paginatedIncidents: Incident[] = [];
  loading = true;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  pages: number[] = [];
  filterStatut: string = 'ALL';

  // Set des incidents nouveaux
  newIncidentIds = new Set<number>();

  constructor(
    private incidentService: IncidentService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadIncidents();

    // Écouter les incidents créés depuis le formulaire
    window.addEventListener('newIncidentCreated', (e: any) => {
      const newId = e.detail;
      if (newId !== undefined) {
        this.newIncidentIds.add(newId);
        this.loadIncidents();
      }
    });
  }

  loadIncidents(): void {
    this.incidentService.getIncidents().subscribe({
      next: (data: any[]) => {
        const previousIds = new Set<number>(JSON.parse(localStorage.getItem('seenIncidents') || '[]'));

        this.incidents = data.map(i => {
          const code = i.Code ?? i.code;
          let dateFromCode: Date | null = null;
          const match = code?.match(/^EI-(\d{8})-/);
          if (match) {
            const rawDate = match[1];
            const year = parseInt(rawDate.substring(0, 4), 10);
            const month = parseInt(rawDate.substring(4, 6), 10) - 1;
            const day = parseInt(rawDate.substring(6, 8), 10);
            dateFromCode = new Date(year, month, day);
          }

          return {
            id: i.Id ?? i.id,
            code,
            type: i.Type ?? i.type,
            gravite: i.Gravite ?? i.gravite,
            description: i.Description ?? i.description,
            dateSurvenue: i.DateSurvenue,
            dateDetection: i.DateDetection,
            localisation: i.Localisation ?? i.localisation,
            mesuresImmediates: i.MesureImmediat ?? i.mesureImmediat,
            statut: i.Statut ?? i.statut,
            declarantId: i.DeclarantId ?? i.declarantId,
            declarant: i.Declarant ?? i.declarant,
            familleEvenementIndesirableId: i.FamilleEvenementIndesirableId ?? i.familleEvenementIndesirableId,
            dateFromCode
          };
        });

        // Tri décroissant par date puis id
        this.incidents.sort((a: any, b: any) => {
          if (a.dateFromCode && b.dateFromCode) {
            const diff = b.dateFromCode.getTime() - a.dateFromCode.getTime();
            if (diff !== 0) return diff;
          }
          return (b.id ?? 0) - (a.id ?? 0);
        });

        // Détecter les nouveaux incidents
        this.incidents.forEach(i => {
          if (i.id !== undefined && !previousIds.has(i.id)) {
            this.newIncidentIds.add(i.id);
          }
        });

        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    if (this.filterStatut === 'ALL') {
      this.filteredIncidents = [...this.incidents];
    } else {
      this.filteredIncidents = this.incidents.filter(
        i => this.getStatutKey(i.statut).toUpperCase() === this.filterStatut
      );
    }
    this.currentPage = 1;
    this.setupPagination();
  }

  setupPagination(): void {
    this.totalPages = Math.ceil(this.filteredIncidents.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePaginatedIncidents();
  }

  updatePaginatedIncidents(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedIncidents = this.filteredIncidents.slice(start, start + this.itemsPerPage);
  }

  prevPage(): void { if (this.currentPage > 1) { this.currentPage--; this.updatePaginatedIncidents(); } }
  nextPage(): void { if (this.currentPage < this.totalPages) { this.currentPage++; this.updatePaginatedIncidents(); } }
  goToPage(page: number): void { this.currentPage = page; this.updatePaginatedIncidents(); }

  getGraviteLabel(gravite: number): string { return getGraviteLabel(gravite); }

  getGraviteGradient(gravite: number): string {
    const gradients: Record<number, string> = {
      [GraviteEvenement.Benin]: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
      [GraviteEvenement.PeuGrave]: 'linear-gradient(90deg, #8BC34A, #CDDC39)',
      [GraviteEvenement.Moyenne]: 'linear-gradient(90deg, #FFC107, #FF9800)',
      [GraviteEvenement.Grave]: 'linear-gradient(90deg, #FF5722, #F44336)',
      [GraviteEvenement.TresGrave]: 'linear-gradient(90deg, #D32F2F, #B71C1C)',
      [GraviteEvenement.Catastrophique]: 'linear-gradient(90deg, #212121, #000000)'
    };
    return gradients[gravite] || 'linear-gradient(90deg, #6c757d, #495057)';
  }

  getGraviteLevel(gravite: number): number {
    const levels: Record<number, number> = {
      [GraviteEvenement.Benin]: 10,
      [GraviteEvenement.PeuGrave]: 25,
      [GraviteEvenement.Moyenne]: 50,
      [GraviteEvenement.Grave]: 75,
      [GraviteEvenement.TresGrave]: 90,
      [GraviteEvenement.Catastrophique]: 100
    };
    return levels[gravite] || 0;
  }

  getStatutKey(statut: number): string {
    const keys: Record<number, string> = {
      [StatutDeclaration.Brouillon]: 'BROUILLON',
      [StatutDeclaration.Soumis]: 'SOUMIS',
      [StatutDeclaration.EnCoursAnalyse]: 'ENCOURSANALYSE',
      [StatutDeclaration.ActionRequise]: 'ACTIONREQUIS',
      [StatutDeclaration.Resolu]: 'RESOLU',
      [StatutDeclaration.Cloture]: 'CLOTURE'
    };
    return keys[statut] || 'INCONNU';
  }

  getServiceName(incident: any): string {
    return incident?.declarant?.service?.nom ?? 'Service non spécifié';
  }

  // 🔹 Vérifie si l’incident est nouveau
  isNewIncident(id?: number): boolean {
    return id !== undefined && this.newIncidentIds.has(id);
  }

  // 🚀 Ouvre ou édite un incident
  openIncident(incident: Incident, mode: 'view' | 'edit'): void {
    if (incident.id !== undefined) {
      this.newIncidentIds.delete(incident.id);

      const seenIds: number[] = JSON.parse(localStorage.getItem('seenIncidents') || '[]');
      if (!seenIds.includes(incident.id)) {
        seenIds.push(incident.id);
        localStorage.setItem('seenIncidents', JSON.stringify(seenIds));
      }

      this.cdr.detectChanges();

   const route = mode === 'view'
  ? ['/admin/evenement', incident.id]  // ← corrige ici
  : ['/admin/incident-form', incident.id];

this.router.navigate(route);

    }
  }

  getDateFromCode(code?: string): string {
    if (!code) return '';
    const match = code.match(/EI-(\d{8})-/);
    if (match) {
      const rawDate = match[1];
      const year = parseInt(rawDate.substring(0, 4), 10);
      const month = parseInt(rawDate.substring(4, 6), 10) - 1;
      const day = parseInt(rawDate.substring(6, 8), 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('fr-FR');
    }
    return '';
  }
}
