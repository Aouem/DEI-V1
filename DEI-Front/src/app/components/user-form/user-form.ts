import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { User, Service } from '../../../interfaces/user';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./user-form.css']
})
export class UserForm implements OnInit {
  userForm!: FormGroup;
  errorMessage = '';
  isSubmitting = false;
  users: User[] = [];
  services: Service[] = [];
  isEditMode = false;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadServices();
    this.loadUsers();
    this.checkEditMode();
  }

  private checkEditMode(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.userId = id;
        this.loadUserForEdit(id);
      }
    });
  }

  private loadUserForEdit(id: string): void {
    this.authService.getUsersWithServices().subscribe({
      next: (users: User[]) => {
        const user = users.find(u => u.id === id);
        if (user) {
          this.populateForm(user);
        }
      },
      error: (error) => {
        console.error('❌ Erreur chargement utilisateur:', error);
        this.errorMessage = 'Erreur lors du chargement des données';
      }
    });
  }

  private populateForm(user: User): void {
    this.userForm.patchValue({
      userName: user.userName,
      email: user.email,
      role: user.role,
      serviceId: user.service?.id,
      tel: user.tel,
      fonction: user.fonction
    });

    // En mode édition, les champs password ne sont pas obligatoires
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('confirmPassword')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();
  }

  private initForm(): void {
    this.userForm = this.fb.group(
      {
        userName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
          ]
        ],
        confirmPassword: [''],
        role: ['', Validators.required],
        serviceId: [null, Validators.required],
        tel: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
        fonction: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private loadServices(): void {
    this.authService.getServices().subscribe({
      next: (services: Service[]) => {
        this.services = services;
        if (services.length > 0 && !this.userForm.value.serviceId) {
          this.userForm.patchValue({ serviceId: services[0].id });
        }
      },
      error: (error) => console.error('❌ Erreur chargement services:', error)
    });
  }

  private loadUsers(): void {
    this.authService.getUsersWithServices().subscribe({
      next: (users: User[]) => (this.users = users),
      error: (error) => console.error('❌ Erreur chargement utilisateurs:', error)
    });
  }

  private passwordMatchValidator(control: AbstractControl): {
    [key: string]: boolean;
  } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    if (!password && !confirmPassword) {
      return null; // Les deux champs sont vides, c'est OK en mode édition
    }
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    this.markAllAsTouched();

    if (this.userForm.invalid) {
      this.errorMessage = '⚠️ Veuillez corriger les erreurs dans le formulaire';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValues = this.userForm.value;
    const payload = {
      userName: formValues.userName,
      email: formValues.email,
      password: formValues.password,
      role: this.normalizeRole(formValues.role),
      tel: formValues.tel,
      fonction: formValues.fonction,
      serviceId: Number(formValues.serviceId)
    };

    if (this.isEditMode && this.userId) {
      // Mode édition
      this.authService.updateUser(this.userId, payload).subscribe({
        next: () => {
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          this.handleError(error);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      // Mode création
      this.authService.createUser(payload).subscribe({
        next: () => {
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          this.handleError(error);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  private handleError(error: any): void {
    this.isSubmitting = false;
    this.errorMessage = this.extractErrorMessage(error);
    console.error('❌ Erreur complète:', error);
    console.error('📌 Détail backend:', error.error);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private normalizeRole(role: string): string {
    const roleMappings: { [key: string]: string } = {
      Validateur: 'VALIDATEUR',
      validateur: 'VALIDATEUR',
      Admin: 'ADMIN',
      admin: 'ADMIN',
      Déclarant: 'DECLARANT',
      déclarant: 'DECLARANT',
      Declarant: 'DECLARANT',
      declarant: 'DECLARANT'
    };
    return roleMappings[role] || role.toUpperCase();
  }

  private extractErrorMessage(error: any): string {
    if (error.error?.errors) {
      return Object.values(error.error.errors)
        .flatMap(err => Array.isArray(err) ? err : [err])
        .join('\n');
    }
    return error.error?.message || error.error?.Message || error.message || 'Une erreur inconnue est survenue';
  }

  private markAllAsTouched(group: FormGroup = this.userForm): void {
    Object.values(group.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      }
    });
  }

  get passwordStrength(): number {
    const password = this.userForm.get('password')?.value;
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength += 40;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    return Math.min(strength, 100);
  }

  get passwordStrengthClass(): string {
    const strength = this.passwordStrength;
    if (strength < 40) return 'bg-danger';
    if (strength < 70) return 'bg-warning';
    return 'bg-success';
  }
}