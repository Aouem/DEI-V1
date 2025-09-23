import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AlarmResponse } from '../../interfaces/alarm-response';

@Injectable({
  providedIn: 'root'
})
export class IncidentGrilleService {
  private apiUrl = `${environment.apiUrl}/api/incident-grilles`;

  constructor(private http: HttpClient) { }

  // Lier une grille à un incident
  lierGrilleAIncident(grilleId: number, incidentId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/lier`, { grilleId, incidentId });
  }

  // Récupérer les grilles d'un incident
  getGrillesParIncident(incidentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/incident/${incidentId}`);
  }

  // Récupérer les AlarmResponses
  getAlarmResponses(): Observable<AlarmResponse[]> {
    return this.http.get<AlarmResponse[]>(`${environment.apiUrl}/api/AlarmResponse`, {
      headers: { 'accept': 'text/plain' }
    });
  }
}
