import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Service } from '../../../interfaces/user';
import { AuthService } from '../../services/auth-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services.html',
  styleUrls: ['./services.css']
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  newService: { nom: string } = { nom: '' };
  editMode = false;
  currentServiceId: number | null = null;
  errorMessage = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  get paginatedServices(): Service[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.services.slice(start, end);
  }

  constructor(private authService: AuthService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.authService.getServices().subscribe({
      next: (data: Service[]) => {
        this.services = data.map(s => ({ id: s.id, nom: s.nom }));
        this.totalPages = Math.ceil(this.services.length / this.itemsPerPage) || 1;
        if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
        this.services = [...this.services];
        this.cd.detectChanges();
      },
      error: (err: any) => this.errorMessage = err
    });
  }

  saveService(): void {
    if (!this.newService.nom.trim()) {
      this.errorMessage = "Le nom du service est obligatoire";
      return;
    }

    let action$: Observable<any>;
    if (this.editMode && this.currentServiceId != null) {
      action$ = this.authService.updateService(this.currentServiceId, this.newService);
    } else {
      action$ = this.authService.createService(this.newService);
    }

    action$.subscribe({
      next: () => {
        this.loadServices();        // recharge la liste
        this.cancelEdit();          // quitte le mode édition
        this.newService = { nom: '' }; // reset formulaire
      },
      error: (err: any) => this.errorMessage = err
    });
  }

  editService(service: Service): void {
    this.editMode = true;
    this.currentServiceId = service.id;
    this.newService = { nom: service.nom || '' };
  }

  cancelEdit(): void {
    this.editMode = false;
    this.currentServiceId = null;
    this.newService = { nom: '' };
  }

  deleteService(id: number): void {
    if (confirm('Supprimer ce service ?')) {
      this.authService.deleteService(id).subscribe({
        next: () => this.loadServices(),
        error: (err: any) => this.errorMessage = err
      });
    }
  }

  // Pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
