import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../../interfaces/user';
import { jwtDecode } from 'jwt-decode';


interface Service {
  id: number;
  nom: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authUrl = `${this.apiUrl}/api/Auth/login`;
  public currentUser = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  // =========================
  // 🔹 Services CRUD
  // =========================
  getServices(): Observable<Service[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/Services`).pipe(
      map(data => data.map(s => ({ id: s.id, nom: s.nom }))),
      catchError(this.handleError)
    );
  }

  createService(service: { nom: string }): Observable<Service> {
    return this.http.post<Service>(`${this.apiUrl}/api/Services`, service).pipe(
      catchError(this.handleError)
    );
  }

  updateService(id: number, service: { nom: string }): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/api/Services/${id}`, service).pipe(
      catchError(this.handleError)
    );
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/Services/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // =========================
  // 🔹 Utilisateurs CRUD
  // =========================
// auth-service.ts

getUsersWithServices(): Observable<User[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/utilisateur`).pipe(
    map(users => users.map(user => this.mapToUser(user))),
    catchError(this.handleError)
  );
}

private mapToUser(data: any): User {
  return {
    id: data.id || data.Id || '',
    userName: data.userName || data.UserName || '',
    email: data.email || data.Email || '',
    role: data.role || data.Role || '',
    fonction: data.fonction || data.Fonction || '',
    tel: data.tel || data.Tel || '',
    service: data.service ? {
      id: data.service.id || data.service.Id,
      nom: data.service.nom || data.service.Nom
    } : undefined
  };
}

  createUser(userData: any): Observable<any> {
    const validation = this.validatePassword(userData.password);
    if (!validation.isValid) {
      return throwError(() => new Error(validation.message));
    }

    const payload = {
      userName: userData.userName,
      email: userData.email,
      password: userData.password,
      role: this.normalizeRole(userData.role),
      tel: userData.tel,
      fonction: userData.fonction,
      serviceId: Number(userData.serviceId)
    };

    return this.http.post(`${this.apiUrl}/api/Utilisateur`, payload).pipe(
      tap(res => console.log('✅ Utilisateur créé:', res)),
      catchError(this.handleError)
    );
  }

 deleteUser(id: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/api/utilisateur/${id}`).pipe(
    catchError(this.handleError)
  );
}

updateUser(id: string, user: any): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/api/utilisateur/${id}`, user).pipe(
    catchError(this.handleError)
  );
}
  // =========================
  // 🔹 Authentification
  // =========================
  login(credentials: { UserName: string; Password: string }): Observable<any> {
    return this.http.post<any>(this.authUrl, credentials).pipe(
      tap(response => {
        const token = response.Token || response.token;
        if (!token) throw new Error('Token manquant');

        localStorage.setItem('token', token);
        const user = this.getCurrentUserFromToken(token);
        if (user) this.currentUser.next(user);
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // =========================
  // 🔹 Gestion du rôle
  // =========================
  getRole(): string | null {
    const user = this.currentUser.value || this.getCurrentUserFromToken();
    return user?.role ?? null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  getCurrentUser(): User | null {
    return this.currentUser.value || this.getCurrentUserFromToken();
  }

  private getCurrentUserFromToken(token?: string): User | null {
    const jwtToken = token || localStorage.getItem('token');
    if (!jwtToken) return null;

    try {
      const decoded: any = jwtDecode(jwtToken);

      return {
        id: decoded.sub ?? null,
        userName:
          decoded.name ??
          decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ??
          null,
        role:
          decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
          decoded.role ??
          null,
        email:
          decoded.email ??
          decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ??
          null,
        fonction: decoded.fonction ?? null,
        tel: decoded.tel ?? null,
        service: decoded.service
          ? {
              id: decoded.service.id ?? null,
              nom: decoded.service.nom ?? null
            }
          : undefined
      };
    } catch (err) {
   //   console.error('❌ Erreur décodage token:', err);
      return null;
    }
  }

  // =========================
  // 🔹 Utilitaires internes
  // =========================
  private validatePassword(password: string): { isValid: boolean; message?: string } {
    if (!password) return { isValid: false, message: 'Le mot de passe est requis' };

    const requirements = [
      { test: password.length >= 8, message: '8 caractères minimum' },
      { test: /[A-Z]/.test(password), message: 'au moins une majuscule (A-Z)' },
      { test: /[a-z]/.test(password), message: 'au moins une minuscule (a-z)' },
      { test: /[0-9]/.test(password), message: 'au moins un chiffre (0-9)' }
    ];

    const failed = requirements.filter(r => !r.test);
    if (failed.length > 0) {
      return {
        isValid: false,
        message:
          'Le mot de passe doit contenir :\n' +
          failed.map(r => `- ${r.message}`).join('\n')
      };
    }
    return { isValid: true };
  }

 private normalizeRole(role: string): string {
  const roleMappings: { [key: string]: string } = {
    'Administrateur': 'ADMIN',
    'administrateur': 'ADMIN',
    'Admin': 'ADMIN',
    'admin': 'ADMIN',
    'Validateur': 'VALIDATEUR',
    'validateur': 'VALIDATEUR',
    'Déclarant': 'DECLARANT',
    'Declarant': 'DECLARANT',
    'déclarant': 'DECLARANT',
    'declarant': 'DECLARANT'
  };
  return roleMappings[role] || role.toUpperCase();
}

  // =========================
  // 🔹 Gestion centralisée des erreurs
  // =========================
  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Erreur inconnue';
    if (error.error instanceof ErrorEvent) {
      message = `Erreur client: ${error.error.message}`;
    } else if (error.error) {
      if (typeof error.error === 'string') message = error.error;
      else if (error.error.message) message = error.error.message;
      else if (error.error.title) message = error.error.title;
      else if (error.error.errors) {
        message = Object.entries(error.error.errors)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join('\n');
      } else message = `Erreur serveur: ${error.status} ${error.statusText}`;
    } else {
      message = `Erreur serveur: ${error.status} ${error.statusText}`;
    }
    return throwError(() => new Error(message));
  }
}
