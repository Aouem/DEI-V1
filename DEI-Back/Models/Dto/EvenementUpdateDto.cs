using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using DEI.Models;

namespace DEI.Models.Dto
{
    public class EvenementUpdateDto
    {
        [Required]
     //   public int Id { get; set; }

        public TypeEvenement? Type { get; set; }
        public GraviteEvenement? Gravite { get; set; }
        public StatutDeclaration? Statut { get; set; }

        [StringLength(2000)]
        public string? Description { get; set; }

        public DateTime? DateSurvenue { get; set; }
        public DateTime? DateDetection { get; set; }

        public string? Localisation { get; set; }
        public string? MesureImmediat { get; set; }
        public bool? Evitable { get; set; }

        // --- Éléments concernés ---
public bool? DossierPatient { get; set; }
public string? DossierPatientPrecision { get; set; }
public bool? Personnel { get; set; }
public string? PersonnelPrecision { get; set; }
public bool? Usager { get; set; }
public string? UsagerPrecision { get; set; }
public bool? Visiteur { get; set; }
public string? VisiteurPrecision { get; set; }
 public bool? Fournisseur { get; set; }
  public string? FournisseurPrecision { get; set; }
public bool? MaterielConcerne { get; set; }
public string? MaterielConcernePrecision { get; set; }
public bool? AutreElement { get; set; }
public string? AutreElementPrecision { get; set; }

// --- Nature Soins ---
public bool? NatureSoinsRetardPEC { get; set; }
public bool? NatureSoinsComplication { get; set; }
public bool? NatureSoinsErreurMedicamenteuse { get; set; }
public bool? NatureSoinsRetardTraitement { get; set; }
public bool? NatureSoinsInfection { get; set; }
public bool? NatureSoinsChutePatient { get; set; }
public bool? NatureSoinsFugue { get; set; }
public bool? NatureSoinsEscarre { get; set; }
public bool? NatureSoinsDefautTransmission { get; set; }
public bool? NatureSoinsAutre { get; set; }
public string? NatureSoinsAutrePrecision { get; set; }

// --- Accueil ---
public bool? NatureAccueilManqueInfo { get; set; }
public bool? NatureAccueilCommViolente { get; set; }
public bool? NatureAccueilComportement { get; set; }
public bool? NatureAccueilAbsenceEcoute { get; set; }
public bool? NatureAccueilErreurOrientation { get; set; }
public bool? NatureAccueilAutre { get; set; }
public string? NatureAccueilAutrePrecision { get; set; }

// --- Droits ---
public bool? DroitDignite { get; set; }
public bool? DroitReligion { get; set; }
public bool? DroitInfoAbsente { get; set; }
public bool? DroitAccesDossier { get; set; }
public bool? DroitChoixMedecin { get; set; }
public bool? DroitConfidentialite { get; set; }
public bool? DroitConsentement { get; set; }
public bool? DroitAutre { get; set; }
public string? DroitAutrePrecision { get; set; }

// --- Dossier ---
public bool? DossierPerte { get; set; }
public bool? DossierIncomplet { get; set; }
public bool? DossierInfoManquante { get; set; }
public bool? DossierAccesNonAutorise { get; set; }
public bool? DossierMalRedige { get; set; }
public bool? DossierAutre { get; set; }
public string? DossierAutrePrecision { get; set; }

// --- Transport ---
public bool? TransportAbsence { get; set; }
public bool? TransportRetard { get; set; }
public bool? TransportDefectueux { get; set; }
public bool? TransportPanne { get; set; }
public bool? TransportNonEquipe { get; set; }
public bool? TransportCollision { get; set; }
public bool? TransportAutre { get; set; }
public string? TransportAutrePrecision { get; set; }

// --- Risques ---
public bool? RisqueAES { get; set; }
public bool? RisqueInfection { get; set; }
public bool? RisqueMaladiePro { get; set; }
public bool? RisqueChute { get; set; }
public bool? RisqueTMS { get; set; }
public bool? RisqueChimique { get; set; }
public bool? RisqueRadioactif { get; set; }
public bool? RisquePsycho { get; set; }
public bool? RisqueBlessure { get; set; }
public bool? RisqueHarcelement { get; set; }
public bool? RisqueAutre { get; set; }
public string? RisqueAutrePrecision { get; set; }

// --- Identité ---
public bool? IdentiteConfusion { get; set; }
public bool? IdentiteEchange { get; set; }
public bool? IdentiteDoublon { get; set; }
public bool? IdentiteAutre { get; set; }
public string? IdentiteAutrePrecision { get; set; }

// --- Hôtellerie ---
public bool? HotelChambreSale { get; set; }
public bool? HotelLingeSale { get; set; }
public bool? HotelPoubelle { get; set; }
public bool? HotelLit { get; set; }
public bool? HotelDouche { get; set; }
public bool? HotelAutre { get; set; }
public string? HotelAutrePrecision { get; set; }

// --- Organisation ---
public bool? OrgRuptureStock { get; set; }
public bool? OrgDefaillanceInfo { get; set; }
public bool? OrgInterruptionAppro { get; set; }
public bool? OrgErreurCommande { get; set; }
public bool? OrgGestionStock { get; set; }
public bool? OrgRetardLivraison { get; set; }
public bool? OrgAutre { get; set; }
public string? OrgAutrePrecision { get; set; }

// --- Sécurité ---
public bool? SecuIncendie { get; set; }
public bool? SecuInondation { get; set; }
public bool? SecuExplosion { get; set; }
public bool? SecuEffondrement { get; set; }
public bool? SecuAgression { get; set; }
public bool? SecuChantier { get; set; }
public bool? SecuAutre { get; set; }
public string? SecuAutrePrecision { get; set; }

// --- Biens ---
public bool? BienPerte { get; set; }
public bool? BienDeterioration { get; set; }
public bool? BienConfusion { get; set; }
public bool? BienVol { get; set; }
public bool? BienAutre { get; set; }
public string? BienAutrePrecision { get; set; }

// --- Restauration ---
public bool? RestoIntoxication { get; set; }
public bool? RestoAvarie { get; set; }
public bool? RestoDegoutant { get; set; }
public bool? RestoRegime { get; set; }
public bool? RestoRetard { get; set; }
public bool? RestoVaisselle { get; set; }
public bool? RestoAutre { get; set; }
public string? RestoAutrePrecision { get; set; }

// --- Technique ---
public bool? TechElectricite { get; set; }
public bool? TechPlomberie { get; set; }
public bool? TechClimatisation { get; set; }
public bool? TechFluides { get; set; }
public bool? TechAscenseur { get; set; }
public bool? TechEquipement { get; set; }
public bool? TechAutre { get; set; }
public string? TechAutrePrecision { get; set; }

// --- Environnement ---
public bool? EnvPollution { get; set; }
public bool? EnvDechets { get; set; }
public bool? EnvEau { get; set; }
public bool? EnvAir { get; set; }
public bool? EnvOdeur { get; set; }
public bool? EnvAnimaux { get; set; }
public bool? EnvInsectes { get; set; }
public bool? EnvAutre { get; set; }
public string? EnvAutrePrecision { get; set; }

// --- Déclarant ---
public string? DeclarantUserName { get; set; }
public string? DeclarantEmail { get; set; }
public string? DeclarantFonction { get; set; }
public string? DeclarantTel { get; set; }

public string? CausesImmediates { get; set; }
        public string? CausesProfondes { get; set; }

        // Évaluation
        public string? Evaluation { get; set; }

        public bool? EvaluationEfficace { get; set; }
        public bool? EvaluationInefficace { get; set; }
        public DateTime? EvaluationDate { get; set; }
        public string? EvaluationResponsable { get; set; }

            public int? FamilleEvenementIndesirableId { get; set; }


        // Clôture
        public DateTime? DateCloture { get; set; }

        public List<ActionCorrectiveDto>? ActionsCorrectives { get; set; }
    }
}
