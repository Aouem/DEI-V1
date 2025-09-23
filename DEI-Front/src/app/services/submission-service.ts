import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubmissionData } from '../../interfaces/SubmissionData';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private apiUrl = `${environment.apiUrl}/api/AlarmResponse`; // API backend

  constructor(private http: HttpClient) {}


  private currentIncident: any = null;

  /** 🔹 Obtenir toutes les submissions */
  getAllSubmissions(): Observable<SubmissionData[]> {
    return this.http.get<SubmissionData[]>(this.apiUrl);
  }

  /** 🔹 Obtenir une submission par id */
  getSubmissionById(id: number): Observable<SubmissionData> {
    return this.http.get<SubmissionData>(`${this.apiUrl}/${id}`);
  }

  /** 🔹 Créer une nouvelle submission */
  createSubmission(submission: Omit<SubmissionData, 'id' | 'createdAt'>): Observable<SubmissionData> {
    return this.http.post<SubmissionData>(this.apiUrl, submission);
  }

  /** 🔹 Supprimer une submission */
  deleteSubmission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /** 🔹 Filtrer par incident */
  getSubmissionsByIncidentId(incidentId: number): Observable<SubmissionData[]> {
    return this.http.get<SubmissionData[]>(`${this.apiUrl}?incidentId=${incidentId}`);
  }
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
