import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { SubmissionCreate, SubmissionData } from '../../interfaces/SubmissionData';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private apiUrl = `${environment.apiUrl}/api/AlarmResponse`; // URL de l'API backend
  private currentIncident: any = null;

  constructor(private http: HttpClient) {}

  /** 🔹 Obtenir toutes les submissions */
  getAllSubmissions(): Observable<SubmissionData[]> {
    return this.http.get<SubmissionData[]>(this.apiUrl).pipe(
      catchError(err => {
        console.error('Erreur lors de la récupération de toutes les submissions:', err);
        return of([]);
      })
    );
  }

  /** 🔹 Obtenir une submission par ID */
getSubmissionById(id: number): Observable<SubmissionData | null> {
  if (!id) return of(null);
  
  const url = `${this.apiUrl}/${id}`;
  console.log('🔄 Appel API vers:', url);
  
  return this.http.get<SubmissionData>(url).pipe(
    catchError(err => {
      console.error(`❌ Erreur API pour ID ${id}:`, err);
      return of(null);
    })
  );
}

  /** 🔹 Créer une nouvelle submission */
  createSubmission(payload: SubmissionCreate): Observable<SubmissionData | null> {
    return this.http.post<SubmissionData>(this.apiUrl, payload).pipe(
      catchError(err => {
        console.error('Erreur lors de la création de la submission:', err);
        return of(null);
      })
    );
  }

  /** 🔹 Supprimer une submission */
  deleteSubmission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        console.error(`Erreur lors de la suppression de la submission ID ${id}:`, err);
        return of();
      })
    );
  }

  /** 🔹 Filtrer par incident ID */
  getSubmissionsByIncidentId(incidentId: number): Observable<SubmissionData[]> {
    if (!incidentId) return of([]);
    return this.http.get<SubmissionData[]>(`${this.apiUrl}/by-incident/${incidentId}`).pipe(
      catchError(err => {
        console.error(`Erreur lors de la récupération des submissions pour l'incident ${incidentId}:`, err);
        return of([]);
      })
    );
  }

  /** 🔹 Gestion de l'incident courant */
  setCurrentIncident(incident: any): void {
    this.currentIncident = incident;
    localStorage.setItem('currentIncident', JSON.stringify(incident));
  }

  getCurrentIncident(): any {
    if (!this.currentIncident) {
      const stored = localStorage.getItem('currentIncident');
      if (stored) this.currentIncident = JSON.parse(stored);
    }
    return this.currentIncident;
  }
}
