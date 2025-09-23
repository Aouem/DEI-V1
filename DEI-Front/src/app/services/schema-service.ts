// src/app/services/schema.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ArbreDto {
  id: number;
  incidentId: number;
  dateSurvenue: string;
  schemaUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class SchemaService {
  private baseUrl = `${environment.apiUrl}/api/Schema`;

  constructor(private http: HttpClient) { }

  // Upload fichier
  uploadFile(file: File, evenementId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload/${evenementId}`, formData);
  }

  // Ancien endpoint listFiles()
  listFiles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/list`);
  }

  // Nouveau endpoint listFilesWithIncident
  listFilesWithIncident(): Observable<ArbreDto[]> {
    return this.http.get<ArbreDto[]>(`${this.baseUrl}/listWithIncident`);
  }

  // Construire URL d’un fichier
  getFileUrl(fileName: string): string {
    return `${environment.apiUrl}/uploads/${fileName}`;
  }

  // ✅ Correction ici
  deleteFile(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

    // ← nouvelle méthode pour récupérer les grilles
  getGrillesByIncident(incidentId: number): Observable<any[]> {
    return this.http.get<any[]>(`/api/schema/grilles/${incidentId}`);
  }
}
