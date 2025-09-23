import { Injectable } from '@angular/core';
import { Incident } from '../../interfaces/incident';

@Injectable({ providedIn: 'root' })
export class IncidentStateService {
  private currentIncident: Incident | null = null;

  setCurrentIncident(incident: Incident): void {
    this.currentIncident = incident;
    sessionStorage.setItem('currentIncident', JSON.stringify(incident));
  }

  getCurrentIncident(): Incident | null {
    if (!this.currentIncident) {
      const stored = sessionStorage.getItem('currentIncident');
      if (stored) this.currentIncident = JSON.parse(stored);
    }
    return this.currentIncident;
  }

  clearCurrentIncident(): void {
    this.currentIncident = null;
    sessionStorage.removeItem('currentIncident');
  }
}
