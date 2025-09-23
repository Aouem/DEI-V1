import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-button',
  standalone: false,
  template: `
    <button class="btn btn-home" (click)="goHome()">
      🏠 Accueil
    </button>
  `,
  styles: [`
    .btn-home {
      background-color: #2575fc;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.2s;
      font-weight: bold;
    }
    .btn-home:hover {
      background-color: #1a5ed8;
    }
  `]
})
export class HomeButtonComponent {
  constructor(private router: Router) {}

  goHome() {
    // Navigue vers le dashboard admin
    this.router.navigate(['/admin']);
  }
}