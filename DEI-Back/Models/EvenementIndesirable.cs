using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DEI.Models
{
    public class EvenementIndesirable
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Display(Name = "Code")]
        public string Code { get; set; } = "EI-" + DateTime.Now.ToString("yyyyMMdd-") + Guid.NewGuid().ToString().Substring(0, 4);

        [Required]
        [Display(Name = "Type d'événement")]
        public TypeEvenement Type { get; set; }

        [Required]
        [Display(Name = "Gravité")]
        public GraviteEvenement Gravite { get; set; }

        [Display(Name = "Statut")]
        public StatutDeclaration Statut { get; set; } = StatutDeclaration.Brouillon;

        [Required]
        [Display(Name = "Description")]
        [StringLength(2000)]
        public string? Description { get; set; }

        [Required]
        [Display(Name = "Date de survenue")]
        [DataType(DataType.DateTime)]
        public DateTime DateSurvenue { get; set; } = DateTime.Now;

        [Required]
        [Display(Name = "Date de détection")]
        [DataType(DataType.DateTime)]
        public DateTime DateDetection { get; set; } = DateTime.Now;

        [Display(Name = "Date de déclaration")]
        [DataType(DataType.DateTime)]
        public DateTime? DateDeclaration { get; set; } = DateTime.Now;

    // [Display(Name = "Image associée")]
// public string? ImageUrl { get; set; }

[Display(Name = "Schéma")]
public string? SchemaUrl { get; set; }  // <-- nouvelle propriété




        [Required]
        [Display(Name = "Localisation")]
        public string? Localisation { get; set; }

        [Required]
        public string? DeclarantId { get; set; }

        [ForeignKey("DeclarantId")]
        public virtual Utilisateur? Declarant { get; set; }

        [Display(Name = "Mesure immédiate")]
        [StringLength(1000)]
        public string? MesureImmediat { get; set; }

        public ICollection<ActionCorrective> ActionsCorrectives { get; set; } = new List<ActionCorrective>();

        [Required]
        public int FamilleEvenementIndesirableId { get; set; }
        public FamilleEvenementIndesirable? Famille { get; set; }

        [Required]
        [Display(Name = "Évitable")]
        public bool? Evitable { get; set; }

        // --- PARTIE COORDONNATEUR ---
        [Display(Name = "Causes immédiates")]
        [StringLength(1000)]
        public string? CausesImmediates { get; set; }

        [Display(Name = "Causes profondes")]
        [StringLength(1000)]
        public string? CausesProfondes { get; set; }

        [Display(Name = "Évaluation")]
        public string? Evaluation { get; set; }


        [Display(Name = "Évaluation efficace")]
        public bool? EvaluationEfficace { get; set; }

        [Display(Name = "Évaluation inefficace")]
        public bool? EvaluationInefficace { get; set; }

        [Display(Name = "Date d'évaluation")]
        [DataType(DataType.DateTime)]
        public DateTime? EvaluationDate { get; set; }

        [Display(Name = "Responsable évaluation")]
        [StringLength(100)]
        public string? EvaluationResponsable { get; set; }

        [Display(Name = "Date de clôture")]
        [DataType(DataType.DateTime)]
        public DateTime? DateCloture { get; set; }

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

        // --- Droits du patient ---
        public bool? DroitDignite { get; set; }
        public bool? DroitReligion { get; set; }
        public bool? DroitInfoAbsente { get; set; }
        public bool? DroitAccesDossier { get; set; }
        public bool? DroitChoixMedecin { get; set; }
        public bool? DroitConfidentialite { get; set; }
        public bool? DroitConsentement { get; set; }
        public bool? DroitAutre { get; set; }
        public string? DroitAutrePrecision { get; set; }

        // --- Dossier médical ---
        public bool? DossierPerte { get; set; }
        public bool? DossierIncomplet { get; set; }
        public bool? DossierInfoManquante { get; set; }
        public bool? DossierAccesNonAutorise { get; set; }
        public bool? DossierMalRedige { get; set; }
        public bool? DossierAutre { get; set; }
        public string? DossierAutrePrecision { get; set; }

        // --- Identité ---
        public bool? IdentiteConfusion { get; set; }
        public bool? IdentiteEchange { get; set; }
        public bool? IdentiteDoublon { get; set; }
        public bool? IdentiteAutre { get; set; }
        public string? IdentiteAutrePrecision { get; set; }

        // --- Biens ---
        public bool? BienPerte { get; set; }
        public bool? BienDeterioration { get; set; }
        public bool? BienConfusion { get; set; }
        public bool? BienVol { get; set; }
        public bool? BienAutre { get; set; }
        public string? BienAutrePrecision { get; set; }

        // --- Environnement ---
        public bool? EnvAir { get; set; }
        public bool? EnvAnimaux { get; set; }
        public bool? EnvAutre { get; set; }
        public string? EnvAutrePrecision { get; set; }
        public bool? EnvDechets { get; set; }
        public bool? EnvEau { get; set; }
        public bool? EnvInsectes { get; set; }
        public bool? EnvOdeur { get; set; }
        public bool? EnvPollution { get; set; }

        // --- Technique ---
        public bool? TechElectricite { get; set; }
        public bool? TechPlomberie { get; set; }
        public bool? TechClimatisation { get; set; }
        public bool? TechFluides { get; set; }
        public bool? TechAscenseur { get; set; }
        public bool? TechEquipement { get; set; }
        public bool? TechAutre { get; set; }
        public string? TechAutrePrecision { get; set; }

        // --- Accueil ---
        public bool? NatureAccueilManqueInfo { get; set; }
        public bool? NatureAccueilCommViolente { get; set; }
        public bool? NatureAccueilComportement { get; set; }
        public bool? NatureAccueilAbsenceEcoute { get; set; }
        public bool? NatureAccueilErreurOrientation { get; set; }
        public bool? NatureAccueilAutre { get; set; }
        public string? NatureAccueilAutrePrecision { get; set; }

        // --- Sécurité ---
        public bool? SecuExplosion { get; set; }
        public bool? SecuEffondrement { get; set; }
        public bool? SecuAgression { get; set; }
        public bool? SecuChantier { get; set; }
        public bool? SecuAutre { get; set; }
        public string? SecuAutrePrecision { get; set; }
        public bool? SecuIncendie { get; set; }
        public bool? SecuInondation { get; set; }

        // --- Description et éléments ---
        public string? DescriptionFaits { get; set; }
        public bool? Personnel { get; set; }
        public string? PersonnelPrecision { get; set; }
        public bool? Usager { get; set; }
        public string? UsagerPrecision { get; set; }
        public bool? Visiteur { get; set; }
        public string? VisiteurPrecision { get; set; }
        public bool? AutreElement { get; set; }
        public string? AutreElementPrecision { get; set; }

        // --- Restauration ---
        public bool? RestoIntoxication { get; set; }
        public bool? RestoAvarie { get; set; }
        public bool? RestoDegoutant { get; set; }
        public bool? RestoRegime { get; set; }
        public bool? RestoRetard { get; set; }
        public bool? RestoVaisselle { get; set; }
        public bool? RestoAutre { get; set; }
        public string? RestoAutrePrecision { get; set; }

        // --- Risques divers ---
        public bool? RisqueAES { get; set; }
        public bool? RisqueAutre { get; set; }
        public string? RisqueAutrePrecision { get; set; }
        public bool? RisqueBlessure { get; set; }
        public bool? RisqueChimique { get; set; }
        public bool? RisqueChute { get; set; }
        public bool? RisqueHarcelement { get; set; }
        public bool? RisqueInfection { get; set; }
        public bool? RisqueMaladiePro { get; set; }
        public bool? RisquePsycho { get; set; }
        public bool? RisqueRadioactif { get; set; }
        public bool? RisqueTMS { get; set; }

        // --- Hôtellerie ---
        public bool? HotelChambreSale { get; set; }
        public bool? HotelLingeSale { get; set; }
        public bool? HotelPoubelle { get; set; }
        public bool? HotelLit { get; set; }
        public bool? HotelDouche { get; set; }
        public bool? HotelAutre { get; set; }
        public string? HotelAutrePrecision { get; set; }

        // --- Transport ---
        public bool? TransportAbsence { get; set; }
        public bool? TransportRetard { get; set; }
        public bool? TransportDefectueux { get; set; }
        public bool? TransportPanne { get; set; }
        public bool? TransportNonEquipe { get; set; }
        public bool? TransportCollision { get; set; }
        public bool? TransportAutre { get; set; }
        public string? TransportAutrePrecision { get; set; }

        // --- Organisation ---
        public bool? OrgRuptureStock { get; set; }
        public bool? OrgDefaillanceInfo { get; set; }
        public bool? OrgInterruptionAppro { get; set; }
        public bool? OrgErreurCommande { get; set; }
        public bool? OrgGestionStock { get; set; }
        public bool? OrgRetardLivraison { get; set; }
        public bool? OrgAutre { get; set; }
        public string? OrgAutrePrecision { get; set; }

        public bool? DossierPatient { get; set; }
        public string? DossierPatientPrecision { get; set; }
        public bool? MaterielConcerne { get; set; }
        public string? MaterielConcernePrecision { get; set; }
        public bool? Fournisseur { get; set; }
        public string? FournisseurPrecision { get; set; }
        
        
    }

    public enum TypeEvenement
    {
        ErreurMedicamenteuse,
        ChutePatient,
        InfectionNosocomiale,
        DefaillanceEquipement,
        ErreurDocumentation,
        ProblemeAdministratif,
        Autre
    }

    public enum GraviteEvenement
    {
        Benin = 0,
        PeuGrave = 1,
        Grave = 2,
        TresGrave = 3,
        Catastrophique = 4
    }

    public enum StatutDeclaration
    {
        Brouillon = 0,
        Soumis = 1,
        EnCoursAnalyse = 2,
        ActionRequise = 3,
        Resolu = 4,
        Cloture = 5
    }
}