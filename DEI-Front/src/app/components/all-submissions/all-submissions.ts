import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubmissionData } from '../../../interfaces/SubmissionData';
import { SubmissionService } from '../../services/submission-service';

@Component({
  selector: 'app-all-submissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-submissions.html',
  styleUrls: ['./all-submissions.css']
})
export class AllSubmissionsComponent implements OnInit {
  submissions: SubmissionData[] = [];
  filteredSubmissions: SubmissionData[] = [];
  pagedSubmissions: SubmissionData[] = [];
  incidentFilter: number | null = null;
  isLoading = true;
  hasError = false;

  pageSize = 10;
  currentPage = 1;

  constructor(
    private submissionService: SubmissionService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSubmissions();
  }

  private loadSubmissions(): void {
    this.isLoading = true;
    this.hasError = false;

    this.submissionService.getAllSubmissions().subscribe({
      next: (subs: SubmissionData[]) => {
        // Correction: Utiliser incidentId au lieu de alarmResponseId
        this.submissions = (subs || []).map(sub => ({
          ...sub,
          // Si incidentId est 0 mais qu'on a des alarmResponseId dans les réponses
          incidentId: this.extractGrilleAlarmId(sub)
        }));
        
        this.filteredSubmissions = [...this.submissions];
        this.currentPage = 1;
        this.updatePagedSubmissions();
        this.isLoading = false;
        
        this.cdr.detectChanges();
        
        console.log('Submissions avec incidentId corrigé:', this.submissions);
      },
      error: (err: any) => {
        console.error('Erreur API:', err);
        this.submissions = [];
        this.filteredSubmissions = [];
        this.pagedSubmissions = [];
        this.isLoading = false;
        this.hasError = true;
        this.cdr.detectChanges();
      }
    });
  }

  /** Extrait le grilleAlarmId (alarmResponseId) pour l'utiliser comme incidentId */
  private extractGrilleAlarmId(sub: SubmissionData): number {
    // Si incidentId est déjà valide, on le garde
    if (sub.incidentId && sub.incidentId > 0) {
      return sub.incidentId;
    }
    
    // Sinon, on prend le alarmResponseId de la première réponse
    if (sub.reponses && sub.reponses.length > 0) {
      const responseWithAlarmId = sub.reponses.find(r => 
        r.alarmResponseId != null && r.alarmResponseId > 0
      );
      return responseWithAlarmId?.alarmResponseId || 0;
    }
    
    return 0;
  }

  /** Retourne l'incidentId (qui contient maintenant grilleAlarmId) */
getIncidentId(sub: SubmissionData): number | null {
  // Priorité 1: metadata.incidentId
  if (sub.metadata?.incidentId && sub.metadata.incidentId > 0) {
    return sub.metadata.incidentId;
  }
  
  // Priorité 2: incidentId direct
  if (sub.incidentId && sub.incidentId > 0) {
    return sub.incidentId;
  }
  
  // Priorité 3: alarmResponseId des réponses
  if (sub.reponses && sub.reponses.length > 0) {
    const responseWithIncident = sub.reponses.find(r => 
      r.alarmResponseId != null && r.alarmResponseId > 0
    );
    return responseWithIncident?.alarmResponseId || null;
  }
  
  return null;
}

  /** Retourne tous les incidentIds uniques (grilleAlarmId) */
  getUniqueIncidentIds(): number[] {
    if (this.submissions.length === 0) return [];
    
    const incidentIds = new Set<number>();
    this.submissions.forEach(sub => {
      if (sub.incidentId && sub.incidentId > 0) {
        incidentIds.add(sub.incidentId);
      }
    });
    
    return Array.from(incidentIds).sort((a, b) => a - b);
  }

  /** Applique le filtre par incidentId (grilleAlarmId) */
  applyFilters(): void {
    console.log('Filtrage demandé avec incidentId:', this.incidentFilter);
    
    if (this.incidentFilter === null || this.incidentFilter === 0) {
      this.filteredSubmissions = [...this.submissions];
    } else {
      // Maintenant on filtre directement par incidentId
      this.filteredSubmissions = this.submissions.filter(sub =>
        sub.incidentId === this.incidentFilter
      );
    }
    
    this.currentPage = 1;
    this.updatePagedSubmissions();
    
    console.log('Résultat du filtrage:', {
      incidentFilter: this.incidentFilter,
      total: this.submissions.length,
      filtered: this.filteredSubmissions.length
    });
  }

  /** Met à jour les soumissions affichées sur la page courante */
  private updatePagedSubmissions(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedSubmissions = this.filteredSubmissions.slice(startIndex, startIndex + this.pageSize);
  }

  /** Pagination */
  totalPages(): number {
    return Math.max(Math.ceil(this.filteredSubmissions.length / this.pageSize), 1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
    this.updatePagedSubmissions();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updatePagedSubmissions();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedSubmissions();
    }
  }

  /** Réinitialise le filtre */
  clearFilter(): void {
    this.incidentFilter = null;
    this.filteredSubmissions = [...this.submissions];
    this.currentPage = 1;
    this.updatePagedSubmissions();
  }

  /** Navigation vers la page de détail */
  viewSubmission(id: number): void {
    this.router.navigate(['/admin/confirmation', id]);
  }

  /** TrackBy function pour l'optimisation */
  trackBySubmissionId(index: number, submission: SubmissionData): number {
    return submission.id;
  }

  /** Recharger les données */
  reloadData(): void {
    this.loadSubmissions();
  }

  /** Supprimer une soumission */
/** Supprimer une soumission */
deleteSubmission(sub: SubmissionData): void {
  if (!sub.id) return;

  if (confirm(`Voulez-vous vraiment supprimer la soumission #${sub.id} ?`)) {
    this.submissionService.deleteSubmission(sub.id).subscribe({
      next: () => {
        console.log(`Soumission ${sub.id} supprimée ✅`);
        // Recharger toute la liste après suppression
        this.loadSubmissions();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
        alert('❌ Échec de la suppression.');
      }
    });
  }
}


}