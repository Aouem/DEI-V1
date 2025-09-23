export interface ServiceDto {
  id: number;
  nom: string;
}

export interface DeclarantDto {
  id: string;
  userName: string;
  email: string;
  fonction: string;
  tel: string;
  service?: ServiceDto;
}

export interface FamilleDto {
  id: number;
  nom: string;
}

export interface ActionCorrectiveDto {
  description: string;
  responsableId: string;
  dateEcheance: string;
  estTerminee: boolean;
}

export interface IncidentDto {
  id: number;
  code: string;
  type: number; // ou enum si tu en as un
  gravite: number;
  description: string;
  dateSurvenue: string;
  dateDetection: string;
  dateDeclaration: string;
  localisation: string;
  mesureImmediat: string;
  evitable: boolean;
  declarant?: DeclarantDto;
  famille?: FamilleDto;
  actionsCorrectives?: ActionCorrectiveDto[];

  // Champs d’évaluation manquants
  evaluationEfficace: boolean;
  evaluationInefficace: boolean;
  evaluationDate: string;
  evaluationResponsable: string;
  dateCloture: string;
}
