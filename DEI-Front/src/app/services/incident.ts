import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError, tap, map } from 'rxjs';
import { Incident } from '../../interfaces/incident';
import { environment } from '../../environments/environment';
import { EvenementCreateDto } from '../../interfaces/EvenementCreateDto';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private apiUrl = `${environment.apiUrl}/api/Evenements`;
  private defaultFamilleId = 1;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // 🔹 Récupérer tous les incidents
  getIncidents(): Observable<Incident[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders()
    }).pipe(
      map(data => data.map(i => this.mapIncident(i))),
      catchError(this.handleError)
    );
  }

  // 🔹 Récupérer un incident par ID
getIncidentById(id: number): Observable<Incident> {
  return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
    tap(data => console.log('Données brutes reçues :', data)), // <-- log ici
    map(data => this.mapIncident(data)),
    catchError(this.handleError)
  );
}


 // Dans incident.service.ts
updateIncident(id: number, incident: any): Observable<any> {
  // Créez un payload avec seulement les champs nécessaires pour l'update
  const payload = {
  //  id: incident.id,
    type: incident.type,
    gravite: incident.gravite,
    statut: incident.statut,
    description: incident.description,
    localisation: incident.localisation,
    mesureImmediat: incident.mesureImmediat,
    evitable: incident.evitable,

    // Champs coordonnateur
    causesImmediates: incident.causesImmediates,
    causesProfondes: incident.causesProfondes,
    evaluationEfficace: incident.evaluationEfficace,
    evaluationInefficace: incident.evaluationInefficace,
    evaluationDate: incident.evaluationDate,
    evaluationResponsable: incident.evaluationResponsable,
    dateCloture: incident.dateCloture,

    // Éléments concernés
    dossierPatient: incident.dossierPatient,
    dossierPatientPrecision: incident.dossierPatientPrecision,
    personnel: incident.personnel,
    personnelPrecision: incident.personnelPrecision,
    usager: incident.usager,
    usagerPrecision: incident.usagerPrecision,
    visiteur: incident.visiteur,
    visiteurPrecision: incident.visiteurPrecision,
    fournisseur: incident.fournisseur,
    fournisseurPrecision: incident.fournisseurPrecision,
    materielConcerne: incident.materielConcerne,
    materielConcernePrecision: incident.materielConcernePrecision,
    autreElement: incident.autreElement,
    autreElementPrecision: incident.autreElementPrecision,

    // Toutes les autres propriétés booléennes...
    natureSoinsRetardPEC: incident.natureSoinsRetardPEC,
    natureSoinsComplication: incident.natureSoinsComplication,
    // ... (ajoutez toutes les autres propriétés)

    familleEvenementIndesirableId: incident.famille?.id || incident.familleEvenementIndesirableId,

    // Actions correctives simplifiées
      actionsCorrectives: incident.actionsCorrectives?.map((ac: any) => ({
      id: ac.id,
      description: ac.description,
      responsableId: ac.responsableId,
        responsableNom: ac.responsableNom, 
      dateEcheance: ac.dateEcheance,
      estTerminee: ac.estTerminee
    }))
  };


  return this.http.put<Incident>(`${this.apiUrl}/${id}`, payload, {
    headers: this.getHeaders() // ⭐ Ajoutez les headers
  }).pipe(
    catchError(this.handleError) // ⭐ Ajoutez la gestion d'erreur
  );
}

  // 🔹 Créer un nouvel incident
  createIncident(incident: EvenementCreateDto): Observable<Incident> {
    try {
      const payload = this.validateAndPreparePayload(incident);
      console.log('Final payload being sent:', payload);

      return this.http.post<Incident>(this.apiUrl, payload, {
        headers: this.getHeaders(),
        observe: 'response'
      }).pipe(
        tap({
          next: (response) => console.log('Success response:', response),
          error: (error) => console.error('Error in request:', error)
        }),
        map(response => this.mapIncident(response.body)),
        catchError(this.handleError)
      );
    } catch (error) {
      return throwError(() => error);
    }
  }
  // ✅ Mapper la réponse API vers un Incident harmonisé
  private mapIncident(data: any): Incident {
  console.log('Données à mapper:', data);
  
  return {
    id: data.id,
    code: data.code,
    type: data.type,
    gravite: data.gravite,
    statut: data.statut,
    description: data.description,
    dateSurvenue: new Date(data.dateSurvenue),
    dateDetection: new Date(data.dateDetection),
    dateDeclaration: data.dateDeclaration ? new Date(data.dateDeclaration) : null,
    localisation: data.localisation,
    mesureImmediat: data.mesureImmediat,
    fournisseur: data.fournisseur ?? false,                    // ← AJOUTEZ
    fournisseurPrecision: data.fournisseurPrecision ?? '',    
    evitable: data.evitable ?? false,
    causesImmediates: data.causesImmediates || '',
    causesProfondes: data.causesProfondes || '',

    // --- AJOUTEZ TOUS CES CHAMPS ---
    dossierPatient: data.dossierPatient ?? false,
    dossierPatientPrecision: data.dossierPatientPrecision ?? '',
    personnel: data.personnel ?? false,
    personnelPrecision: data.personnelPrecision ?? '',
    usager: data.usager ?? false,
    usagerPrecision: data.usagerPrecision ?? '',
    visiteur: data.visiteur ?? false,
    visiteurPrecision: data.visiteurPrecision ?? '',
    materielConcerne: data.materielConcerne ?? false,
    materielConcernePrecision: data.materielConcernePrecision ?? '',
    autreElement: data.autreElement ?? false,
    autreElementPrecision: data.autreElementPrecision ?? '',

    // Nature Soins
    natureSoinsRetardPEC: data.natureSoinsRetardPEC ?? false,
    natureSoinsComplication: data.natureSoinsComplication ?? false,
    natureSoinsErreurMedicamenteuse: data.natureSoinsErreurMedicamenteuse ?? false,
    natureSoinsRetardTraitement: data.natureSoinsRetardTraitement ?? false,
    natureSoinsInfection: data.natureSoinsInfection ?? false,
    natureSoinsChutePatient: data.natureSoinsChutePatient ?? false,
    natureSoinsFugue: data.natureSoinsFugue ?? false,
    natureSoinsEscarre: data.natureSoinsEscarre ?? false,
    natureSoinsDefautTransmission: data.natureSoinsDefautTransmission ?? false,
    natureSoinsAutre: data.natureSoinsAutre ?? false,
    natureSoinsAutrePrecision: data.natureSoinsAutrePrecision ?? '',

    // Nature Accueil
    natureAccueilManqueInfo: data.natureAccueilManqueInfo ?? false,
    natureAccueilCommViolente: data.natureAccueilCommViolente ?? false,
    natureAccueilComportement: data.natureAccueilComportement ?? false,
    natureAccueilAbsenceEcoute: data.natureAccueilAbsenceEcoute ?? false,
    natureAccueilErreurOrientation: data.natureAccueilErreurOrientation ?? false,
    natureAccueilAutre: data.natureAccueilAutre ?? false,
    natureAccueilAutrePrecision: data.natureAccueilAutrePrecision ?? '',

    // Droits
    droitDignite: data.droitDignite ?? false,
    droitReligion: data.droitReligion ?? false,
    droitInfoAbsente: data.droitInfoAbsente ?? false,
    droitAccesDossier: data.droitAccesDossier ?? false,
    droitChoixMedecin: data.droitChoixMedecin ?? false,
    droitConfidentialite: data.droitConfidentialite ?? false,
    droitConsentement: data.droitConsentement ?? false,
    droitAutre: data.droitAutre ?? false,
    droitAutrePrecision: data.droitAutrePrecision ?? '',

    // Dossier
    dossierPerte: data.dossierPerte ?? false,
    dossierIncomplet: data.dossierIncomplet ?? false,
    dossierInfoManquante: data.dossierInfoManquante ?? false,
    dossierAccesNonAutorise: data.dossierAccesNonAutorise ?? false,
    dossierMalRedige: data.dossierMalRedige ?? false,
    dossierAutre: data.dossierAutre ?? false,
    dossierAutrePrecision: data.dossierAutrePrecision ?? '',

    // Transport
    transportAbsence: data.transportAbsence ?? false,
    transportRetard: data.transportRetard ?? false,
    transportDefectueux: data.transportDefectueux ?? false,
    transportPanne: data.transportPanne ?? false,
    transportNonEquipe: data.transportNonEquipe ?? false,
    transportCollision: data.transportCollision ?? false,
    transportAutre: data.transportAutre ?? false,
    transportAutrePrecision: data.transportAutrePrecision ?? '',

    // Risques
    risqueAES: data.risqueAES ?? false,
    risqueInfection: data.risqueInfection ?? false,
    risqueMaladiePro: data.risqueMaladiePro ?? false,
    risqueChute: data.risqueChute ?? false,
    risqueTMS: data.risqueTMS ?? false,
    risqueChimique: data.risqueChimique ?? false,
    risqueRadioactif: data.risqueRadioactif ?? false,
    risquePsycho: data.risquePsycho ?? false,
    risqueBlessure: data.risqueBlessure ?? false,
    risqueHarcelement: data.risqueHarcelement ?? false,
    risqueAutre: data.risqueAutre ?? false,
    risqueAutrePrecision: data.risqueAutrePrecision ?? '',

    // Identité
    identiteConfusion: data.identiteConfusion ?? false,
    identiteEchange: data.identiteEchange ?? false,
    identiteDoublon: data.identiteDoublon ?? false,
    identiteAutre: data.identiteAutre ?? false,
    identiteAutrePrecision: data.identiteAutrePrecision ?? '',

    // Hôtellerie
    hotelChambreSale: data.hotelChambreSale ?? false,
    hotelLingeSale: data.hotelLingeSale ?? false,
    hotelPoubelle: data.hotelPoubelle ?? false,
    hotelLit: data.hotelLit ?? false,
    hotelDouche: data.hotelDouche ?? false,
    hotelAutre: data.hotelAutre ?? false,
    hotelAutrePrecision: data.hotelAutrePrecision ?? '',

    // Organisation
    orgRuptureStock: data.orgRuptureStock ?? false,
    orgDefaillanceInfo: data.orgDefaillanceInfo ?? false,
    orgInterruptionAppro: data.orgInterruptionAppro ?? false,
    orgErreurCommande: data.orgErreurCommande ?? false,
    orgGestionStock: data.orgGestionStock ?? false,
    orgRetardLivraison: data.orgRetardLivraison ?? false,
    orgAutre: data.orgAutre ?? false,
    orgAutrePrecision: data.orgAutrePrecision ?? '',

    // Sécurité
    secuIncendie: data.secuIncendie ?? false,
    secuInondation: data.secuInondation ?? false,
    secuExplosion: data.secuExplosion ?? false,
    secuEffondrement: data.secuEffondrement ?? false,
    secuAgression: data.secuAgression ?? false,
    secuChantier: data.secuChantier ?? false,
    secuAutre: data.secuAutre ?? false,
    secuAutrePrecision: data.secuAutrePrecision ?? '',

    // Biens
    bienPerte: data.bienPerte ?? false,
    bienDeterioration: data.bienDeterioration ?? false,
    bienConfusion: data.bienConfusion ?? false,
    bienVol: data.bienVol ?? false,
    bienAutre: data.bienAutre ?? false,
    bienAutrePrecision: data.bienAutrePrecision ?? '',

    // Restauration
    restoIntoxication: data.restoIntoxication ?? false,
    restoAvarie: data.restoAvarie ?? false,
    restoDegoutant: data.restoDegoutant ?? false,
    restoRegime: data.restoRegime ?? false,
    restoRetard: data.restoRetard ?? false,
    restoVaisselle: data.restoVaisselle ?? false,
    restoAutre: data.restoAutre ?? false,
    restoAutrePrecision: data.restoAutrePrecision ?? '',

    // Technique
    techElectricite: data.techElectricite ?? false,
    techPlomberie: data.techPlomberie ?? false,
    techClimatisation: data.techClimatisation ?? false,
    techFluides: data.techFluides ?? false,
    techAscenseur: data.techAscenseur ?? false,
    techEquipement: data.techEquipement ?? false,
    techAutre: data.techAutre ?? false,
    techAutrePrecision: data.techAutrePrecision ?? '',

    // Environnement
    envPollution: data.envPollution ?? false,
    envDechets: data.envDechets ?? false,
    envEau: data.envEau ?? false,
    envAir: data.envAir ?? false,
    envOdeur: data.envOdeur ?? false,
    envAnimaux: data.envAnimaux ?? false,
    envInsectes: data.envInsectes ?? false,
    envAutre: data.envAutre ?? false,
    envAutrePrecision: data.envAutrePrecision ?? '',



    

    // Relations
      declarantId: data.declarantId ?? (data.declarant ? data.declarant.id : null),
    familleEvenementIndesirableId: data.familleEvenementIndesirableId ?? (data.famille ? data.famille.id : null),
    declarant: data.declarant,
    famille: data.famille,
   actionsCorrectives: data.actionsCorrectives?.map((ac: any) => ({
  id: ac.id,
  description: ac.description,
  responsableId: ac.responsableId,
  responsableNom: ac.responsableNom, // ✅
  dateEcheance: ac.dateEcheance
        ? new Date(ac.dateEcheance).toISOString().split('T')[0]
        : '',  estTerminee: ac.estTerminee
})) || [],


// ✅ Champs d’évaluation et de clôture
evaluationEfficace: data.evaluationEfficace ?? false,
evaluationInefficace: data.evaluationInefficace ?? false,
evaluationResponsable: data.evaluationResponsable ?? '',
evaluationDate: data.evaluationDate ? new Date(data.evaluationDate) : undefined,
dateCloture: data.dateCloture ? new Date(data.dateCloture) : undefined,



  };
}
  // ✅ Headers avec token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  }

  // ✅ Vérifie & prépare le payload à envoyer
  private validateAndPreparePayload(incident: EvenementCreateDto): EvenementCreateDto {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      throw new Error('No authenticated user found');
    }

    const requiredFields: (keyof EvenementCreateDto)[] = [
      'type', 'gravite', 'description',
      'dateSurvenue', 'localisation', 'mesureImmediat'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = incident[field];
      return value === undefined || value === null || value === '';
    });

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return {
      ...incident,
      code: incident.code || this.generateEventCode(),
      type: Number(incident.type),
      gravite: Number(incident.gravite),
      description: incident.description!.trim(),
      dateSurvenue: this.formatDate(incident.dateSurvenue),
      dateDetection: this.formatDate(incident.dateDetection || new Date()),
      localisation: incident.localisation!.trim(),
      mesureImmediat: incident.mesureImmediat!.trim(),
      declarantId: currentUser.id,
      familleEvenementIndesirableId: incident.familleEvenementIndesirableId || this.defaultFamilleId,
      actionsCorrectives: incident.actionsCorrectives || []
    };
  }

  // ✅ Formatage des dates
  private formatDate(date: Date | string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) throw new Error('Invalid date');
    return d.toISOString();
  }

  // ✅ Génération code automatique
  private generateEventCode(): string {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `EI-${datePart}-${randomPart}`;
  }

  // ✅ Gestion des erreurs
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);

    let errorDetails = 'No additional details';
    if (error.error) {
      errorDetails = typeof error.error === 'object'
        ? JSON.stringify(error.error)
        : error.error.toString();
    }

    const errorMessage = `Server returned ${error.status}: ${error.statusText}\nDetails: ${errorDetails}`;
    return throwError(() => new Error(errorMessage));
  }

  // ⭐ CORRECTION : Utilisez l'URL complète au lieu de actionsApiUrl
  updateActionsCorrectives(eventId: number, actions: any[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/${eventId}/actions`, actions, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  createActionsCorrectives(actions: any[]): Observable<any> {
    // ⭐ CORRECTION : Utilisez l'URL complète
    return this.http.post(`${environment.apiUrl}/api/ActionCorrective/multiple`, actions, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Méthodes individuelles pour les actions correctives
  getActionCorrective(id: number): Observable<any> {
    // ⭐ CORRECTION : Utilisez l'URL complète
    return this.http.get(`${environment.apiUrl}/api/ActionCorrective/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  createActionCorrective(action: any): Observable<any> {
    // ⭐ CORRECTION : Utilisez l'URL complète
    return this.http.post(`${environment.apiUrl}/api/ActionCorrective`, action, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateActionCorrective(id: number, action: any): Observable<any> {
    // ⭐ CORRECTION : Utilisez l'URL complète
    return this.http.put(`${environment.apiUrl}/api/ActionCorrective/${id}`, action, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteActionCorrective(id: number): Observable<any> {
    // ⭐ CORRECTION : Utilisez l'URL complète
    return this.http.delete(`${environment.apiUrl}/api/ActionCorrective/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }
  

  uploadIncidentImage(formData: FormData): Observable<any> {
  return this.http.post(`${environment.apiUrl}/api/Schema/upload`, formData);
}

}