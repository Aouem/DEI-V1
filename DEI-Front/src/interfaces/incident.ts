import type { ActionCorrective } from "./ActionCorrective";

// === Enums ===
export enum TypeEvenement {
  ErreurMedicamenteuse = 0,
  ChutePatient = 1,
  InfectionNosocomiale = 2,
  DefaillanceEquipement = 3,
  ErreurDocumentation = 4,
  ProblemeAdministratif = 5,
  Autre = 6
}

export const TypeEvenementLabels: Record<TypeEvenement, string> = {
  [TypeEvenement.ErreurMedicamenteuse]: "Erreur médicamenteuse",
  [TypeEvenement.ChutePatient]: "Chute patient",
  [TypeEvenement.InfectionNosocomiale]: "Infection nosocomiale",
  [TypeEvenement.DefaillanceEquipement]: "Défaillance équipement",
  [TypeEvenement.ErreurDocumentation]: "Erreur documentation",
  [TypeEvenement.ProblemeAdministratif]: "Problème administratif",
  [TypeEvenement.Autre]: "Autre"
};





export enum GraviteEvenement {
  Benin = 1,
  PeuGrave = 2,
  Moyenne = 3,
  Grave = 4,
  TresGrave = 5,
  Catastrophique = 6,
  
}
export const GraviteEvenementLabels: Record<GraviteEvenement, string> = {
  [GraviteEvenement.Benin]: "Benin",
  [GraviteEvenement.PeuGrave]: "PeuGrave",
  [GraviteEvenement.Moyenne]: "Moyenne",
  [GraviteEvenement.Grave]: "Grave",
  [GraviteEvenement.TresGrave]: "TresGrave",
  [GraviteEvenement.Catastrophique]: "Catastrophique"
};

export enum StatutDeclaration {
  Brouillon = 0,
  Soumis = 1,
  EnCoursAnalyse = 2,
  ActionRequise = 3,
  Resolu = 4,
  Cloture = 5
}

export const StatutDeclarationLabels: Record<StatutDeclaration, string> = {
  [StatutDeclaration.Brouillon]: "Brouillon",
  [StatutDeclaration.Soumis]: "Soumis",
  [StatutDeclaration.EnCoursAnalyse]: "En cours d’analyse",
  [StatutDeclaration.ActionRequise]: "Action requise",
  [StatutDeclaration.Resolu]: "Résolu",
  [StatutDeclaration.Cloture]: "Clôturé"
};

// === Base Incident ===
interface BaseIncident {
  type: TypeEvenement;
  gravite: GraviteEvenement;
  statut: StatutDeclaration;
  description: string;
  dateSurvenue: Date;
  dateDetection: Date;
  localisation: string;
  declarantId: string;
  familleEvenementIndesirableId: number;
}

// === Incident complet ===
export interface Incident extends BaseIncident {
  id?: number;
  code?: string;
  mesureImmediat?: string;
  actionsCorrectives?: ActionCorrective[];
  dateCreation?: Date;
  dateModification?: Date;
    imageUrl?: string; // ← champ pour stocker l'URL de l'image


  // --- Personnes / Éléments concernés ---
  dossierPatient?: boolean;
  dossierPatientPrecision?: string;

  personnel?: boolean;
  personnelPrecision?: string;

  usager?: boolean;
  usagerPrecision?: string;

  visiteur?: boolean;
  visiteurPrecision?: string;

  materielConcerne?: boolean;
  materielConcernePrecision?: string;

  autreElement?: boolean;
  autreElementPrecision?: string;

  // --- Environnement ---
  envPollution?: boolean;
  envDechets?: boolean;
  envEau?: boolean;
  envAir?: boolean;
  envOdeur?: boolean;
  envAnimaux?: boolean;
  envInsectes?: boolean;
  envAutre?: boolean;
  envAutrePrecision?: string;

  // --- Technique ---
  techElectricite?: boolean;
  techPlomberie?: boolean;
  techClimatisation?: boolean;
  techFluides?: boolean;
  techAscenseur?: boolean;
  techEquipement?: boolean;
  techAutre?: boolean;
  techAutrePrecision?: string;

  // --- Accueil ---
  natureAccueilManqueInfo?: boolean;
  natureAccueilCommViolente?: boolean;
  natureAccueilComportement?: boolean;
  natureAccueilAbsenceEcoute?: boolean;
  natureAccueilErreurOrientation?: boolean;
  natureAccueilAutre?: boolean;
  natureAccueilAutrePrecision?: string;

  // --- Identité ---
  identiteDoublon?: boolean;
  identiteAutre?: boolean;
  identiteAutrePrecision?: string;

  // --- Sécurité ---
  secuExplosion?: boolean;
  secuEffondrement?: boolean;
  secuAgression?: boolean;
  secuChantier?: boolean;
  secuAutre?: boolean;
  secuAutrePrecision?: string;

  // --- Biens ---
  bienPerte?: boolean;
  bienDeterioration?: boolean;
  bienConfusion?: boolean;
  bienVol?: boolean;
  bienAutre?: boolean;
  bienAutrePrecision?: string;

  // --- Restauration ---
  restoIntoxication?: boolean;
  restoAvarie?: boolean;
  restoDegoutant?: boolean;
  restoRegime?: boolean;
  restoRetard?: boolean;
  restoVaisselle?: boolean;
  restoAutre?: boolean;
  restoAutrePrecision?: string;

  // --- Soins ---
  evitable?: boolean;
  natureSoinsRetardPEC?: boolean;
  natureSoinsComplication?: boolean;
  natureSoinsErreurMedicamenteuse?: boolean;
  natureSoinsRetardTraitement?: boolean;
  natureSoinsInfection?: boolean;
  natureSoinsChutePatient?: boolean;
  natureSoinsFugue?: boolean;
  natureSoinsEscarre?: boolean;
  natureSoinsDefautTransmission?: boolean;
  natureSoinsAutre?: boolean;
  natureSoinsAutrePrecision?: string;

  // --- Droits ---
  droitDignite?: boolean;
  droitReligion?: boolean;
  droitInfoAbsente?: boolean;
  droitAccesDossier?: boolean;
  droitChoixMedecin?: boolean;
  droitConfidentialite?: boolean;
  droitConsentement?: boolean;
  droitAutre?: boolean;
  droitAutrePrecision?: string;

  // --- Risques ---
  risqueAES?: boolean;
  risqueInfection?: boolean;
  risqueMaladiePro?: boolean;
  risqueChute?: boolean;
  risqueTMS?: boolean;
  risqueChimique?: boolean;
  risqueRadioactif?: boolean;
  risquePsycho?: boolean;
  risqueBlessure?: boolean;
  risqueHarcelement?: boolean;
  risqueAutre?: boolean;
  risqueAutrePrecision?: string;




   evaluationEfficace?: boolean;
  evaluationInefficace?: boolean;
  evaluationDate?: string | Date;
  evaluationResponsable?: string;
  dateCloture?: string | Date;

  // --- Déclarant ---
  declarant?: {
    id: string;
    userName?: string;
    email?: string;
    fonction?: string;
    tel?: string;
    service?: {
      id: number;
      nom: string;
    };
  };

  // --- Famille ---
  famille?: FamilleEvenement;

  // fallback pour dynamique
  [key: string]: any;
}

// === Famille ===
export interface FamilleEvenement {
  id: number;
  nom: string;
}

// === Utils ===
export type CreateIncident = Omit<
  Incident,
  "id" | "code" | "dateCreation" | "dateModification"
>;

export type UpdateIncident = Partial<Omit<Incident, "id">> & Pick<Incident, "id">;

export type IncidentFilters = Partial<{
  type: TypeEvenement;
  gravite: GraviteEvenement;
  statut: StatutDeclaration;
  dateDebut: Date;
  dateFin: Date;
}>;

export interface PaginatedIncidents {
  data: Incident[];
  page: number;
  pageSize: number;
  totalCount: number;
}
