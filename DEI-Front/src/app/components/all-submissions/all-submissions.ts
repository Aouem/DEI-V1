import { Component, OnInit } from '@angular/core';
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
  isFiltering: boolean = false;

  pageSize = 10;
  currentPage = 1;

  constructor(
    private submissionService: SubmissionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer incidentId depuis l'URL
    this.route.queryParams.subscribe(params => {
      const incidentParam = params['incidentId'];
      this.incidentFilter = incidentParam ? +incidentParam : null;
      this.loadSubmissions();
    });
  }

  /** Chargement des submissions via backend */
  private loadSubmissions(): void {
    this.submissionService.getAllSubmissions().subscribe({
      next: (subs: SubmissionData[]) => {
        this.submissions = subs;

        // Filtrage automatique par incidentId si défini
        this.filteredSubmissions = this.incidentFilter != null
          ? this.submissions.filter(sub => sub.metadata?.incidentId === this.incidentFilter)
          : [...this.submissions];

        this.currentPage = 1;
        this.updatePagedSubmissions();
        console.log('Submissions chargées:', this.filteredSubmissions);
      },
      error: (err: any) => {
        console.error('Erreur API:', err);
        this.submissions = [];
        this.filteredSubmissions = [];
        this.pagedSubmissions = [];
      }
    });
  }

  /** Pagination */
  private updatePagedSubmissions(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedSubmissions = this.filteredSubmissions.slice(startIndex, startIndex + this.pageSize);
  }

  totalPages(): number {
    return Math.ceil(this.filteredSubmissions.length / this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
    this.updatePagedSubmissions();
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  /** Filtrage manuel */
  applyFilters(): void {
  if (this.incidentFilter != null) {
    this.filteredSubmissions = this.submissions.filter(
      sub => sub.metadata?.incidentId === this.incidentFilter
    );
  } else {
    this.filteredSubmissions = [...this.submissions];
  }

  // Mettre à jour le flag isFiltering
  this.isFiltering = this.incidentFilter != null && this.filteredSubmissions.length === 0;

  this.currentPage = 1;
  this.updatePagedSubmissions();
}

clearFilter(): void {
  this.incidentFilter = null;
  this.filteredSubmissions = [...this.submissions];
  this.isFiltering = false; // Reset flag
  this.currentPage = 1;
  this.updatePagedSubmissions();
}


  /** Navigation vers la page de confirmation */
  viewSubmission(id: number): void {
    this.router.navigate(['/admin/confirmation', id], { state: { submissionId: id } });
  }
}
