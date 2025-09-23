import { ActionCorrectiveDto } from "./ActionCorrectiveDto";
import { GraviteEvenement } from "./GraviteEvenement";
import { StatutDeclaration } from "./incident";
import { TypeEvenement } from "./TypeEvenement";

export interface EvenementCreateDto {
  code?: string;
  type: TypeEvenement;
  gravite: GraviteEvenement;
  statut?: StatutDeclaration;
  description: string;
  dateSurvenue: string;
  dateDetection?: string;
  dateDeclaration?:string;
  localisation: string;
  mesureImmediat?: string;
  declarantId: string;
  familleEvenementIndesirableId: number;
  actionsCorrectives?: ActionCorrectiveDto[];
  evitable: boolean;

  causesImmediates?: string;   // ✅ ajouté
  causesProfondes?: string;    // ✅ ajouté

  organisation?: boolean;
organisationPrecision?: string;


   fournisseur?: boolean;                // ✅ ajouté
  fournisseurPrecision?: string;        // ✅ pour les précisions

 dossierPatient?: boolean;
  dossierPatientPrecision?: string;
   personnel?: boolean;
  personnelPrecision?: string;

   visiteur?: boolean;              // ✅ ajouté
  visiteurPrecision?: string;      // ✅ ajouté


  usager?: boolean;
    usagerPrecision?: string;

 

  materielConcerne?: boolean;
  autreElement?: boolean;
  autreElementPrecision?: string;

  // --- Nature Soins ---
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

  // --- Accueil ---
  natureAccueilManqueInfo?: boolean;
  natureAccueilCommViolente?: boolean;
  natureAccueilComportement?: boolean;
  natureAccueilAbsenceEcoute?: boolean;
  natureAccueilErreurOrientation?: boolean;
  natureAccueilAutre?: boolean;
  natureAccueilAutrePrecision?: string;
  materielConcernePrecision?: string;

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

  // --- Dossier ---
  dossierPerte?: boolean;
  dossierIncomplet?: boolean;
  dossierInfoManquante?: boolean;
  dossierAccesNonAutorise?: boolean;
  dossierMalRedige?: boolean;
  dossierAutre?: boolean;
  dossierAutrePrecision?: string;

  // --- Transport ---
  transportAbsence?: boolean;
  transportRetard?: boolean;
  transportDefectueux?: boolean;
  transportPanne?: boolean;
  transportNonEquipe?: boolean;
  transportCollision?: boolean;
  transportAutre?: boolean;
  transportAutrePrecision?: string;

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

  // --- Identité ---
  identiteConfusion?: boolean;
  identiteEchange?: boolean;
  identiteDoublon?: boolean;
  identiteAutre?: boolean;
  identiteAutrePrecision?: string;

  // --- Hôtellerie ---
  hotelChambreSale?: boolean;
  hotelLingeSale?: boolean;
  hotelPoubelle?: boolean;
  hotelLit?: boolean;
  hotelDouche?: boolean;
  hotelAutre?: boolean;
  hotelAutrePrecision?: string;

  // --- Organisation ---
  orgRuptureStock?: boolean;
  orgDefaillanceInfo?: boolean;
  orgInterruptionAppro?: boolean;
  orgErreurCommande?: boolean;
  orgGestionStock?: boolean;
  orgRetardLivraison?: boolean;
  orgAutre?: boolean;
  orgAutrePrecision?: string;

  // --- Sécurité ---
  secuIncendie?: boolean;
  secuInondation?: boolean;
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

  // --- Technique ---
  techElectricite?: boolean;
  techPlomberie?: boolean;
  techClimatisation?: boolean;
  techFluides?: boolean;
  techAscenseur?: boolean;
  techEquipement?: boolean;
  techAutre?: boolean;
  techAutrePrecision?: string;

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


  evaluationEfficace?: boolean;
  evaluationInefficace?: boolean;
  evaluationResponsable?: string;

evaluationDate?: string | null;
dateCloture?: string | null;



  // --- Déclarant ---
  declarantUserName?: string;
  declarantEmail?: string;
  declarantFonction?: string;
  declarantTel?: string;
}