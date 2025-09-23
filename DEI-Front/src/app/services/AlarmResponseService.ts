import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlarmResponse } from '../../interfaces/alarm-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlarmResponseService {
  private apiUrl = `${environment.apiUrl}/AlarmResponse`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AlarmResponse[]> {
    return this.http.get<AlarmResponse[]>(this.apiUrl);
  }

  getById(id: number): Observable<AlarmResponse> {
    return this.http.get<AlarmResponse>(`${this.apiUrl}/${id}`);
  }

  create(response: AlarmResponse): Observable<AlarmResponse> {
    return this.http.post<AlarmResponse>(this.apiUrl, response);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
