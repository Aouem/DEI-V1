import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _newIncidentIds = new BehaviorSubject<Set<number>>(new Set());
  newIncidentIds$ = this._newIncidentIds.asObservable();

  constructor() {}

  // Marquer un incident comme nouveau
  markAsNew(id: number) {
    const current = new Set(this._newIncidentIds.value);
    current.add(id);
    this._newIncidentIds.next(current);
  }

  // Retirer un incident ou réinitialiser tous
  reset() {
    this._newIncidentIds.next(new Set());
  }

  // Supprimer un incident spécifique (lorsque l'utilisateur l'a vu)
  markAsSeen(id: number) {
    const current = new Set(this._newIncidentIds.value);
    current.delete(id);
    this._newIncidentIds.next(current);
  }
}
