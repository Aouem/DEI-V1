using System;
using System.Collections.Generic;
using System.Linq;

namespace DEI_Back.Models
{
    #region DTOs

    public class EvenementCreateDto
    {
        public DateTime DateEvenement { get; set; }
        public string? Description { get; set; }
        public string? DescriptionFaits { get; set; }
        public int? DeclarantId { get; set; }
        public int? FamilleEvenementIndesirableId { get; set; }
        public string? ActionImmediate { get; set; }
    }

    public class EvenementUpdateDto
    {
        public int Id { get; set; }
        public string? ActionImmediate { get; set; }

        // Partie coordonnateur / gestion des risques
        public string? CausesImmediates { get; set; }
        public string? CausesProfondes { get; set; }
        public int? Gravite { get; set; }
        public bool? Evitable { get; set; }

        // Actions correctives
        public List<ActionCorrectiveDto>? ActionsCorrectives { get; set; }

        // Evaluation
        public string? Evaluation { get; set; }
        public bool? EvaluationEfficace { get; set; }
        public bool? EvaluationInefficace { get; set; }
        public DateTime? EvaluationDate { get; set; }
        public string? EvaluationResponsable { get; set; }

        // Clôture
        public DateTime? DateCloture { get; set; }
    }

    public class EvenementDto
    {
        public int Id { get; set; }
        public DateTime DateEvenement { get; set; }
        public DateTime DateCreation { get; set; }
        public bool EstCritique { get; set; }

        public List<ActionCorrectiveDto> ActionsCorrectives { get; set; } = new();

        public string? Description { get; set; }
        public string? DescriptionFaits { get; set; }
        public int? DeclarantId { get; set; }
        public int? FamilleEvenementIndesirableId { get; set; }

        public bool? Fournisseur { get; set; }
        public string? FournisseurPrecision { get; set; }

        public bool? DossierPatient { get; set; }
        public string? DossierPatientPrecision { get; set; }
        public bool? Personnel { get; set; }
        public string? PersonnelPrecision { get; set; }
        public bool? Usager { get; set; }
        public string? UsagerPrecision { get; set; }
        public bool? Materiel { get; set; }
        public string? MaterielPrecision { get; set; }
        public bool? Produit { get; set; }
        public string? ProduitPrecision { get; set; }
        public string? Procedure { get; set; }
        public string? ProcedurePrecision { get; set; }
        public bool? Organisation { get; set; }
        public string? OrganisationPrecision { get; set; }
        public string? Communication { get; set; }
        public string? CommunicationPrecision { get; set; }
        public string? FacteursHumains { get; set; }
        public string? FacteursHumainsPrecision { get; set; }
        public string? AutresCauses { get; set; }
        public string? AutresCausesPrecision { get; set; }
        public string? ActionImmediate { get; set; }
            public string? SchemaUrl { get; set; }  // ← AJOUTEZ CETTE LIGNE


        // Champs coordonnateur
        public string? CausesImmediates { get; set; }
        public string? CausesProfondes { get; set; }
        public int? Gravite { get; set; }
        public bool? Evitable { get; set; }

        public string? Evaluation { get; set; }
        public bool? EvaluationEfficace { get; set; }
        public bool? EvaluationInefficace { get; set; }
        public DateTime? EvaluationDate { get; set; }
        public string? EvaluationResponsable { get; set; }
        public DateTime? DateCloture { get; set; }
    }

    public class ActionCorrectiveDto
    {
        public int Id { get; set; }
        public string? Description { get; set; }
        public string? Responsable { get; set; }
        public DateTime? DateEcheance { get; set; }
        public bool? EstTerminee { get; set; }
    }

    #endregion

    #region Entities

    public class EvenementIndesirable
    {
        public int Id { get; set; }
        public DateTime? DateEvenement { get; set; }
        public DateTime? DateCreation { get; set; }
        public bool? EstCritique { get; set; }

            public string? SchemaUrl { get; set; }  // ← AJOUTEZ CETTE LIGNE


        public List<ActionCorrective> ActionsCorrectives { get; set; } = new();

        public bool? Fournisseur { get; set; }
        public string? FournisseurPrecision { get; set; }

        public string? Description { get; set; }
        public string? DescriptionFaits { get; set; }
        public int? DeclarantId { get; set; }
        public int? FamilleEvenementIndesirableId { get; set; }

        public bool? DossierPatient { get; set; }
        public string? DossierPatientPrecision { get; set; }
        public bool? Personnel { get; set; }
        public string? PersonnelPrecision { get; set; }
        public bool? Usager { get; set; }
        public string? UsagerPrecision { get; set; }
        public bool? Materiel { get; set; }
        public string? MaterielPrecision { get; set; }
        public bool? Produit { get; set; }
        public string? ProduitPrecision { get; set; }
        public string? Procedure { get; set; }
        public string? ProcedurePrecision { get; set; }
        public bool? Organisation { get; set; }
        public string? OrganisationPrecision { get; set; }
        public string? Communication { get; set; }
        public string? CommunicationPrecision { get; set; }
        public string? FacteursHumains { get; set; }
        public string? FacteursHumainsPrecision { get; set; }
        public string? AutresCauses { get; set; }
        public string? AutresCausesPrecision { get; set; }
        public string? ActionImmediate { get; set; }

        // Coordonnateur / Gestion des risques
        public string? CausesImmediates { get; set; }
        public string? CausesProfondes { get; set; }
        public int? Gravite { get; set; }
        public bool? Evitable { get; set; }

        public string? Evaluation { get; set; }
        public bool? EvaluationEfficace { get; set; }
        public bool? EvaluationInefficace { get; set; }
        public DateTime? EvaluationDate { get; set; }
        public string? EvaluationResponsable { get; set; }

        public DateTime? DateCloture { get; set; }
    }

    public class ActionCorrective
    {
        public int Id { get; set; }
        public string? Description { get; set; }
        public string? Responsable { get; set; }
        public DateTime? DateEcheance { get; set; }
        public bool? EstTerminee { get; set; }
    }

    #endregion

    #region Mapper

    public static class EvenementMapper
    {
       public static EvenementDto MapToDto(EvenementIndesirable? entity)
{
    if (entity == null) return null;

    return new EvenementDto
    {
        Id = entity.Id,
        DateEvenement = entity.DateEvenement ?? DateTime.MinValue,
        DateCreation = entity.DateCreation ?? DateTime.Now,
        EstCritique = entity.EstCritique ?? false,
        SchemaUrl = entity.SchemaUrl,  // ← CORRIGÉ : utiliser 'entity' au lieu de 'e'

        ActionsCorrectives = entity.ActionsCorrectives?.Select(a => new ActionCorrectiveDto
        {
            Id = a.Id,
            Description = a.Description,
            Responsable = a.Responsable,
            DateEcheance = a.DateEcheance,
            EstTerminee = a.EstTerminee
        }).ToList() ?? new List<ActionCorrectiveDto>(),

                Description = entity.Description,
                
                DescriptionFaits = entity.DescriptionFaits,
                DeclarantId = entity.DeclarantId,
                FamilleEvenementIndesirableId = entity.FamilleEvenementIndesirableId,

                Fournisseur = entity.Fournisseur,
                FournisseurPrecision = entity.FournisseurPrecision,

                DossierPatient = entity.DossierPatient,
                DossierPatientPrecision = entity.DossierPatientPrecision,
                Personnel = entity.Personnel,
                PersonnelPrecision = entity.PersonnelPrecision,
                Usager = entity.Usager,
                UsagerPrecision = entity.UsagerPrecision,
                Materiel = entity.Materiel,
                MaterielPrecision = entity.MaterielPrecision,
                Produit = entity.Produit,
                ProduitPrecision = entity.ProduitPrecision,
                Procedure = entity.Procedure,
                ProcedurePrecision = entity.ProcedurePrecision,
                Organisation = entity.Organisation,
                OrganisationPrecision = entity.OrganisationPrecision,
                Communication = entity.Communication,
                CommunicationPrecision = entity.CommunicationPrecision,
                FacteursHumains = entity.FacteursHumains,
                FacteursHumainsPrecision = entity.FacteursHumainsPrecision,
                AutresCauses = entity.AutresCauses,
                AutresCausesPrecision = entity.AutresCausesPrecision,
                ActionImmediate = entity.ActionImmediate,

                CausesImmediates = entity.CausesImmediates,
                CausesProfondes = entity.CausesProfondes,
                Gravite = entity.Gravite,
                Evitable = entity.Evitable,

                Evaluation = entity.Evaluation,
                EvaluationEfficace = entity.EvaluationEfficace,
                EvaluationInefficace = entity.EvaluationInefficace,
                EvaluationDate = entity.EvaluationDate,
                EvaluationResponsable = entity.EvaluationResponsable,
                DateCloture = entity.DateCloture
            };
        }

        public static EvenementIndesirable MapToEntity(EvenementCreateDto dto)
        {
            if (dto == null) return null;

            return new EvenementIndesirable
            {
                DateEvenement = dto.DateEvenement,
                DateCreation = DateTime.Now,
                EstCritique = false,
                Description = dto.Description,
                DescriptionFaits = dto.DescriptionFaits,
                DeclarantId = dto.DeclarantId,
                FamilleEvenementIndesirableId = dto.FamilleEvenementIndesirableId,
                Fournisseur = false,
                ActionImmediate = dto.ActionImmediate
            };
        }

        public static void MapToEntity(EvenementUpdateDto dto, EvenementIndesirable entity)
        {
            if (dto == null || entity == null) return;

            // Coordonnateur / gestion des risques
            entity.ActionImmediate = dto.ActionImmediate;
            entity.CausesImmediates = dto.CausesImmediates;
            entity.CausesProfondes = dto.CausesProfondes;
            entity.Gravite = dto.Gravite;
            entity.Evitable = dto.Evitable;

            // Actions correctives
            if (dto.ActionsCorrectives != null)
            {
                entity.ActionsCorrectives = dto.ActionsCorrectives.Select(a => new ActionCorrective
                {
                    Id = a.Id,
                    Description = a.Description,
                    Responsable = a.Responsable,
                    DateEcheance = a.DateEcheance,
                    EstTerminee = a.EstTerminee
                }).ToList();
            }

            // Evaluation et clôture
            entity.Evaluation = dto.Evaluation;
            entity.EvaluationEfficace = dto.EvaluationEfficace;
            entity.EvaluationInefficace = dto.EvaluationInefficace;
            entity.EvaluationDate = dto.EvaluationDate;
            entity.EvaluationResponsable = dto.EvaluationResponsable;
            entity.DateCloture = dto.DateCloture;
        }
    }

    #endregion
}
