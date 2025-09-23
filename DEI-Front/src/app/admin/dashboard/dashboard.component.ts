import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user';
import { AuthService } from '../../services/auth-service';
import { Router, RouterModule } from '@angular/router';
import { IncidentService } from '../../services/incident';
import { NotificationService } from '../../services/notification';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  usersCount = 0;
  servicesCount = 0;
  newIncidentCount = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private incidentService: IncidentService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    this.authService.getUsersWithServices().subscribe(users => {
      this.usersCount = users.length;
    });

    this.authService.getServices().subscribe(services => {
      this.servicesCount = services.length;
    });

    // Souscrire aux notifications
    this.notificationService.newIncidentIds$.subscribe((ids: Set<number>) => {
      this.newIncidentCount = ids.size;
    });

    // Vérifier les incidents nouveaux
 this.incidentService.getIncidents().subscribe(incidents => {
  const previousIds = new Set(JSON.parse(localStorage.getItem('seenIncidents') || '[]'));
  incidents.forEach(i => {
    if (i.id !== undefined && !previousIds.has(i.id)) {
      this.notificationService.markAsNew(i.id);
    }
  });
});
  }

  
  navigateTo(path: string): void {
    this.router.navigate([`/admin${path}`]);

    if (path === '/incidents-list') {
      this.notificationService.reset();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
