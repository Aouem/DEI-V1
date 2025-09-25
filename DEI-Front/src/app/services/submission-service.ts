import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { SubmissionCreate, SubmissionData } from '../../interfaces/SubmissionData';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private apiUrl = `${environment.apiUrl}/api/AlarmResponse`; // API backend
  private currentIncident: any = null;

  constructor(private http: HttpClient) {}

  /** 🔹 Obtenir toutes les submissions */
  getAllSubmissions(): Observable<SubmissionData[]> {
    return this.http.get<SubmissionData[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Erreur dans le service:', error);
        return of([]);
      })
    );
  }

  /** 🔹 Obtenir une submission par id */
  getSubmissionById(id: number): Observable<SubmissionData> {
    return this.http.get<SubmissionData>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        console.error('Erreur lors de la récupération par id:', err);
        return of(null as any);
      })
    );
  }

  /** 🔹 Créer une nouvelle submission */
createSubmission(payload: SubmissionCreate): Observable<SubmissionData> {
  return this.http.post<SubmissionData>(this.apiUrl, payload).pipe(
    catchError(err => {
      console.error('Erreur lors de la création de la submission:', err);
      return of(null as any);
    })
  );
}


  /** 🔹 Supprimer une submission */
  deleteSubmission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        console.error('Erreur lors de la suppression:', err);
        return of();
      })
    );
  }

  /** 🔹 Filtrer par incident */
  getSubmissionsByIncidentId(incidentId: number): Observable<SubmissionData[]> {
    return this.http.get<SubmissionData[]>(`${this.apiUrl}/by-incident/${incidentId}`).pipe(
      catchError(err => {
        console.error('Erreur lors de la récupération par incidentId:', err);
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
