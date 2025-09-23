import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User,Service } from '../../../interfaces/user';
import { Router } from '@angular/router';



@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserList implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  pagedUsers: User[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  pages: number[] = [];
  selectedUser: User | null = null;
  userToDelete: User | null = null;

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef,
        private router: Router // <-- Injecter Router

  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.authService.getUsersWithServices().subscribe({
      next: (users: User[]) => {
        this.users = users || [];
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err?.message || 'Erreur lors du chargement';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearchTermChange(): void {
    setTimeout(() => this.applyFilter(), 300);
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      (u.userName?.toLowerCase().includes(term) ?? false) ||
      (u.email?.toLowerCase().includes(term) ?? false) ||
      (u.role?.toLowerCase().includes(term) ?? false) ||
      (u.service?.nom?.toLowerCase().includes(term) ?? false)
    );
    this.totalPages = Math.max(Math.ceil(this.filteredUsers.length / this.pageSize), 1);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.currentPage = 1;
    this.updatePagedUsers();
    this.cdr.detectChanges();
  }

  updatePagedUsers(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedUsers = [...this.filteredUsers.slice(start, start + this.pageSize)];
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedUsers();
  }

   editUser(user: User): void {
    // Navigation vers user-form avec l'ID de l'utilisateur en paramètre
    this.router.navigate(['/admin/user-form', user.id]);
  }

  deleteUser(user: User): void {
    if (!user.id) {
      console.error('ID utilisateur manquant');
      return;
    }

    this.authService.deleteUser(user.id).subscribe({
      next: () => {
        console.log('Utilisateur supprimé');
        this.loadUsers();
        this.userToDelete = null;
      },
      error: (error) => {
        console.error('Erreur suppression:', error);
        this.error = error.message || 'Erreur lors de la suppression';
      }
    });
  }

  updateUser(user: User): void {
    if (!user.id) {
      console.error('ID utilisateur manquant');
      return;
    }

    this.authService.updateUser(user.id, user).subscribe({
      next: () => {
        console.log('Utilisateur modifié');
        this.loadUsers();
        this.selectedUser = null;
      },
      error: (error) => {
        console.error('Erreur modification:', error);
        this.error = error.message || 'Erreur lors de la modification';
      }
    });
  }

  cancelEdit(): void {
    this.selectedUser = null;
  }
}