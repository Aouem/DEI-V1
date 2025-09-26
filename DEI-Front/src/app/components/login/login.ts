// src/app/components/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
   //   console.warn('Formulaire invalide');
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
   // console.log('🔹 Tentative de connexion pour:', this.loginForm.value.userName);

    this.authService.login({
      UserName: this.loginForm.value.userName,
      Password: this.loginForm.value.password
    }).subscribe({
      next: () => {
      //  console.log('✅ Login réussi, récupération de l’utilisateur...');
        const user = this.authService.getCurrentUser();

   //     console.log('🔹 USER CONNECTÉ:', user);

        if (!user) {
       //   console.error('❌ Aucun utilisateur trouvé après login.');
          this.isSubmitting = false;
          return;
        }

        // 🔹 Redirection selon rôle
     //   console.log('🔹 Rôle détecté:', user.role);
       switch (user.role) {
  case 'ADMIN':
    this.router.navigate(['/dashboard-admin']);
    break;
  case 'VALIDATEUR':
    this.router.navigate(['/dashboard-validateur']);
    break;
  case 'DECLARANT':
    this.router.navigate(['/dashboard-user']);
    break;
  default:
    this.router.navigate(['/unauthorized']);
    break;
}


        this.isSubmitting = false;
      },
      error: (error) => {
      //  console.error('❌ Erreur de connexion:', error);
        this.errorMessage = error.message || 'Échec de la connexion';
        this.isSubmitting = false;
      }
    });
  }
}