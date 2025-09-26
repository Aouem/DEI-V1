// src/app/components/arbredecause/arbredecause.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchemaService } from '../../services/schema-service';

interface Arbre {
  id: number;
  incidentId: number;
  dateSurvenue: string;
  schemaUrl: string;
}

@Component({
  selector: 'app-arbredecause',
  templateUrl: './arbredecause.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./arbredecause.css']
})
export class ArbredecauseComponent implements OnInit {

  arbres: Arbre[] = [];
  filteredArbres: Arbre[] = [];
  selectedImageUrl: string | null = null;
  isLoading: boolean = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  arbreToDelete: Arbre | null = null;
  incidentFilter: number | null = null;

  constructor(
    private schemaService: SchemaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadArbres();
  }

  private loadArbres(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.selectedImageUrl = null;

    this.schemaService.listFilesWithIncident().subscribe({
      next: (data: Arbre[]) => {
        if (!data || data.length === 0) {
          this.errorMessage = 'Aucun arbre des causes disponible.';
          this.arbres = [];
          this.filteredArbres = [];
        } else {
          this.arbres = data.sort((a, b) => 
            new Date(b.dateSurvenue).getTime() - new Date(a.dateSurvenue).getTime()
          );
          this.applyFilters(); // Appliquer les filtres après le chargement
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = `Erreur lors du chargement: ${err.message || 'Erreur inconnue'}`;
        this.isLoading = false;
        this.arbres = [];
        this.filteredArbres = [];
        this.cdr.detectChanges();
      }
    });
  }


applyFilters(): void {
  if (!this.arbres.length) {
    this.filteredArbres = [];
    return;
  }

  let filtered = [...this.arbres];

  // Filtre par incidentId (corrigé)
  if (this.incidentFilter !== null && this.incidentFilter > 0) {
    filtered = filtered.filter(arbre => 
      arbre.incidentId === this.incidentFilter
    );
  }

  this.filteredArbres = filtered;
  this.cdr.detectChanges();
}

  clearFilters(): void {
    this.incidentFilter = null;
    this.applyFilters();
  }

  viewArbre(arbre: Arbre): void {
    this.selectedImageUrl = arbre.schemaUrl + `?t=${new Date().getTime()}`; 
  }

  confirmDelete(arbre: Arbre): void {
    this.arbreToDelete = arbre;
    
    const isConfirmed = confirm(`Êtes-vous sûr de vouloir supprimer l'arbre des causes de l'incident ${arbre.incidentId} du ${new Date(arbre.dateSurvenue).toLocaleDateString()} ?`);
    
    if (isConfirmed) {
      this.deleteArbre(arbre);
    } else {
      this.arbreToDelete = null;
    }
  }

  deleteArbre(arbre: Arbre): void {
    this.schemaService.deleteFile(arbre.incidentId).subscribe({
      next: () => {
        // Supprimer des deux tableaux
        this.arbres = this.arbres.filter(a => a.incidentId !== arbre.incidentId);
        this.filteredArbres = this.filteredArbres.filter(a => a.incidentId !== arbre.incidentId);
        
        this.successMessage = '✅ Arbre des causes supprimé avec succès';
        this.selectedImageUrl = null;
        this.arbreToDelete = null;
        
        setTimeout(() => {
          this.successMessage = null;
          this.cdr.detectChanges();
        }, 3000);
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 400) {
        //  console.warn('Aucun schéma à supprimer');
          this.arbres = this.arbres.filter(a => a.incidentId !== arbre.incidentId);
          this.filteredArbres = this.filteredArbres.filter(a => a.incidentId !== arbre.incidentId);
          this.successMessage = '✅ Arbre des causes supprimé avec succès';
        } else {
       //   console.error('Erreur deleteArbre', err);
          this.errorMessage = '❌ Erreur lors de la suppression';
        }
        this.arbreToDelete = null;
        this.cdr.detectChanges();
      }
    });
  }

  reloadFiles(): void {
    this.loadArbres();
  }
}