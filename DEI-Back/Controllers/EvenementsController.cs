using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DEI.Data;
using DEI.Models;
using DEI.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;

namespace DEI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EvenementsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EvenementsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // DTOs pour le frontend
        public class EvenementServiceDto
        {
            public int? Id { get; set; }
            public string? Nom { get; set; }
        }

        // GET: api/Evenements
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EvenementDto>>> GetEvenements()
        {
            var evenements = await _context!.Evenements
                .Include(e => e.Declarant!)
                .ThenInclude(d => d.Service!)
                .Include(e => e.ActionsCorrectives)
                .Include(e => e.Famille!)
                .ToListAsync();

            return evenements.Select(e => MapToDto(e)).ToList();
        }

        // GET: api/Evenements/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EvenementDto>> GetEvenement(int id)
        {
            var evenement = await _context!.Evenements
                .Include(e => e.Declarant!)
                .ThenInclude(d => d.Service!)
                .Include(e => e.ActionsCorrectives!)
                .Include(e => e.Famille!)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (evenement == null)
                return NotFound();

            var result = MapToDto(evenement);
            return result;
        }

        // POST: api/Evenements
        [HttpPost]
        public async Task<ActionResult<EvenementDto>> CreateEvenement([FromBody] EvenementCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var declarantExists = await _context.Utilisateurs.AnyAsync(u => u.Id == dto.DeclarantId);
            if (!declarantExists)
            {
                ModelState.AddModelError("DeclarantId", "L'utilisateur déclarant n'existe pas");
                return BadRequest(ModelState);
            }

            var familleExists = await _context.FamillesEvenements.AnyAsync(f => f.Id == dto.FamilleEvenementIndesirableId);
            if (!familleExists)
            {
                ModelState.AddModelError("FamilleEvenementIndesirableId", "La famille d'événement n'existe pas");
                return BadRequest(ModelState);
            }

            var evenement = new EvenementIndesirable
            {
                Code = dto.Code ?? $"EI-{DateTime.Now:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 4)}",
                Type = dto.Type ?? TypeEvenement.Autre,
                Gravite = dto.Gravite ?? GraviteEvenement.Benin,
                Statut = StatutDeclaration.Brouillon,
                Description = dto.Description,
                DateSurvenue = dto.DateSurvenue ?? DateTime.Now,
                DateDetection = dto.DateDetection ?? DateTime.Now,
                DateDeclaration = DateTime.Now,
                Localisation = dto.Localisation,
                MesureImmediat = dto.MesureImmediat,
                DeclarantId = dto.DeclarantId,
                FamilleEvenementIndesirableId = dto.FamilleEvenementIndesirableId,
                Evitable = dto.Evitable,

                // --- PARTIE COORDONNATEUR ---
                CausesImmediates = dto.CausesImmediates,
                CausesProfondes = dto.CausesProfondes,
                EvaluationEfficace = dto.EvaluationEfficace,
                EvaluationInefficace = dto.EvaluationInefficace,
                EvaluationDate = dto.EvaluationDate,
                EvaluationResponsable = dto.EvaluationResponsable,
                DateCloture = dto.DateCloture,

                // --- Éléments concernés ---
                DossierPatient = dto.DossierPatient,
                DossierPatientPrecision = dto.DossierPatientPrecision,
                Personnel = dto.Personnel,
                PersonnelPrecision = dto.PersonnelPrecision,
                Usager = dto.Usager,
                UsagerPrecision = dto.UsagerPrecision,
                Visiteur = dto.Visiteur,
                VisiteurPrecision = dto.VisiteurPrecision,
                MaterielConcerne = dto.MaterielConcerne,
                MaterielConcernePrecision = dto.MaterielConcernePrecision,
                AutreElement = dto.AutreElement,
                AutreElementPrecision = dto.AutreElementPrecision,
                Fournisseur = dto.Fournisseur ?? false,
                FournisseurPrecision = dto.FournisseurPrecision,

                // --- Nature Soins ---
                NatureSoinsRetardPEC = dto.NatureSoinsRetardPEC,
                NatureSoinsComplication = dto.NatureSoinsComplication,
                NatureSoinsErreurMedicamenteuse = dto.NatureSoinsErreurMedicamenteuse,
                NatureSoinsRetardTraitement = dto.NatureSoinsRetardTraitement,
                NatureSoinsInfection = dto.NatureSoinsInfection,
                NatureSoinsChutePatient = dto.NatureSoinsChutePatient,
                NatureSoinsFugue = dto.NatureSoinsFugue,
                NatureSoinsEscarre = dto.NatureSoinsEscarre,
                NatureSoinsDefautTransmission = dto.NatureSoinsDefautTransmission,
                NatureSoinsAutre = dto.NatureSoinsAutre,
                NatureSoinsAutrePrecision = dto.NatureSoinsAutrePrecision,

                // --- Accueil ---
                NatureAccueilManqueInfo = dto.NatureAccueilManqueInfo,
                NatureAccueilCommViolente = dto.NatureAccueilCommViolente,
                NatureAccueilComportement = dto.NatureAccueilComportement,
                NatureAccueilAbsenceEcoute = dto.NatureAccueilAbsenceEcoute,
                NatureAccueilErreurOrientation = dto.NatureAccueilErreurOrientation,
                NatureAccueilAutre = dto.NatureAccueilAutre,
                NatureAccueilAutrePrecision = dto.NatureAccueilAutrePrecision,

                // --- Droits ---
                DroitDignite = dto.DroitDignite,
                DroitReligion = dto.DroitReligion,
                DroitInfoAbsente = dto.DroitInfoAbsente,
                DroitAccesDossier = dto.DroitAccesDossier,
                DroitChoixMedecin = dto.DroitChoixMedecin,
                DroitConfidentialite = dto.DroitConfidentialite,
                DroitConsentement = dto.DroitConsentement,
                DroitAutre = dto.DroitAutre,
                DroitAutrePrecision = dto.DroitAutrePrecision,

                // --- Dossier ---
                DossierPerte = dto.DossierPerte,
                DossierIncomplet = dto.DossierIncomplet,
                DossierInfoManquante = dto.DossierInfoManquante,
                DossierAccesNonAutorise = dto.DossierAccesNonAutorise,
                DossierMalRedige = dto.DossierMalRedige,
                DossierAutre = dto.DossierAutre,
                DossierAutrePrecision = dto.DossierAutrePrecision,

                // --- Transport ---
                TransportAbsence = dto.TransportAbsence,
                TransportRetard = dto.TransportRetard,
                TransportDefectueux = dto.TransportDefectueux,
                TransportPanne = dto.TransportPanne,
                TransportNonEquipe = dto.TransportNonEquipe,
                TransportCollision = dto.TransportCollision,
                TransportAutre = dto.TransportAutre,
                TransportAutrePrecision = dto.TransportAutrePrecision,

                // --- Risques ---
                RisqueAES = dto.RisqueAES,
                RisqueInfection = dto.RisqueInfection,
                RisqueMaladiePro = dto.RisqueMaladiePro,
                RisqueChute = dto.RisqueChute,
                RisqueTMS = dto.RisqueTMS,
                RisqueChimique = dto.RisqueChimique,
                RisqueRadioactif = dto.RisqueRadioactif,
                RisquePsycho = dto.RisquePsycho,
                RisqueBlessure = dto.RisqueBlessure,
                RisqueHarcelement = dto.RisqueHarcelement,
                RisqueAutre = dto.RisqueAutre,
                RisqueAutrePrecision = dto.RisqueAutrePrecision,

                // --- Identité ---
                IdentiteConfusion = dto.IdentiteConfusion,
                IdentiteEchange = dto.IdentiteEchange,
                IdentiteDoublon = dto.IdentiteDoublon,
                IdentiteAutre = dto.IdentiteAutre,
                IdentiteAutrePrecision = dto.IdentiteAutrePrecision,

                // --- Hôtellerie ---
                HotelChambreSale = dto.HotelChambreSale,
                HotelLingeSale = dto.HotelLingeSale,
                HotelPoubelle = dto.HotelPoubelle,
                HotelLit = dto.HotelLit,
                HotelDouche = dto.HotelDouche,
                HotelAutre = dto.HotelAutre,
                HotelAutrePrecision = dto.HotelAutrePrecision,

                // --- Organisation ---
                OrgRuptureStock = dto.OrgRuptureStock,
                OrgDefaillanceInfo = dto.OrgDefaillanceInfo,
                OrgInterruptionAppro = dto.OrgInterruptionAppro,
                OrgErreurCommande = dto.OrgErreurCommande,
                OrgGestionStock = dto.OrgGestionStock,
                OrgRetardLivraison = dto.OrgRetardLivraison,
                OrgAutre = dto.OrgAutre,
                OrgAutrePrecision = dto.OrgAutrePrecision,

                // --- Sécurité ---
                SecuIncendie = dto.SecuIncendie,
                SecuInondation = dto.SecuInondation,
                SecuExplosion = dto.SecuExplosion,
                SecuEffondrement = dto.SecuEffondrement,
                SecuAgression = dto.SecuAgression,
                SecuChantier = dto.SecuChantier,
                SecuAutre = dto.SecuAutre,
                SecuAutrePrecision = dto.SecuAutrePrecision,

                // --- Biens ---
                BienPerte = dto.BienPerte,
                BienDeterioration = dto.BienDeterioration,
                BienConfusion = dto.BienConfusion,
                BienVol = dto.BienVol,
                BienAutre = dto.BienAutre,
                BienAutrePrecision = dto.BienAutrePrecision,

                // --- Restauration ---
                RestoIntoxication = dto.RestoIntoxication,
                RestoAvarie = dto.RestoAvarie,
                RestoDegoutant = dto.RestoDegoutant,
                RestoRegime = dto.RestoRegime,
                RestoRetard = dto.RestoRetard,
                RestoVaisselle = dto.RestoVaisselle,
                RestoAutre = dto.RestoAutre,
                RestoAutrePrecision = dto.RestoAutrePrecision,

                // --- Technique ---
                TechElectricite = dto.TechElectricite,
                TechPlomberie = dto.TechPlomberie,
                TechClimatisation = dto.TechClimatisation,
                TechFluides = dto.TechFluides,
                TechAscenseur = dto.TechAscenseur,
                TechEquipement = dto.TechEquipement,
                TechAutre = dto.TechAutre,
                TechAutrePrecision = dto.TechAutrePrecision,

                // --- Environnement ---
                EnvPollution = dto.EnvPollution,
                EnvDechets = dto.EnvDechets,
                EnvEau = dto.EnvEau,
                EnvAir = dto.EnvAir,
                EnvOdeur = dto.EnvOdeur,
                EnvAnimaux = dto.EnvAnimaux,
                EnvInsectes = dto.EnvInsectes,
                EnvAutre = dto.EnvAutre,
                EnvAutrePrecision = dto.EnvAutrePrecision
            };

            if (dto.ActionsCorrectives != null && dto.ActionsCorrectives.Any())
            {
                evenement.ActionsCorrectives = dto.ActionsCorrectives.Select(ac => new ActionCorrective
                {
                    Description = ac.Description,
                    DateEcheance = ac.DateEcheance,
                    EstTerminee = ac.EstTerminee,
                    ResponsableNom = ac.ResponsableNom, // ✅ utiliser ResponsableNom
                }).ToList();
            }

            _context.Evenements.Add(evenement);
            await _context.SaveChangesAsync();

            await _context.Entry(evenement).Reference(e => e.Declarant).LoadAsync();
            if (evenement.Declarant != null)
                await _context.Entry(evenement.Declarant).Reference(d => d.Service).LoadAsync();
            await _context.Entry(evenement).Reference(e => e.Famille).LoadAsync();
            await _context.Entry(evenement).Collection(e => e.ActionsCorrectives).LoadAsync();

            return CreatedAtAction(nameof(GetEvenement), new { id = evenement.Id }, MapToDto(evenement));
        }

        // PUT: api/Evenements/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvenement(int id, [FromBody] EvenementUpdateDto dto)
        {
           

            var evenement = await _context.Evenements
                .Include(e => e.ActionsCorrectives)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (evenement == null)
                return NotFound();

             if (dto.FamilleEvenementIndesirableId.HasValue)
    {
        var familleExists = await _context.FamillesEvenements
            .AnyAsync(f => f.Id == dto.FamilleEvenementIndesirableId.Value);
        if (!familleExists)
        {
            ModelState.AddModelError("FamilleEvenementIndesirableId", "La famille d'événement n'existe pas");
            return BadRequest(ModelState);
        }
        evenement.FamilleEvenementIndesirableId = dto.FamilleEvenementIndesirableId.Value;
    }

            // Mise à jour des propriétés de base
            evenement.Type = dto.Type ?? evenement.Type;
            evenement.Gravite = dto.Gravite ?? evenement.Gravite;
            evenement.Statut = dto.Statut ?? evenement.Statut;
            evenement.Description = dto.Description;
            evenement.Localisation = dto.Localisation;
            evenement.MesureImmediat = dto.MesureImmediat;
            evenement.Evitable = dto.Evitable ?? evenement.Evitable;

            // Mise à jour des propriétés étendues
            evenement.DossierPatient = dto.DossierPatient ?? evenement.DossierPatient;
            evenement.DossierPatientPrecision = dto.DossierPatientPrecision ?? evenement.DossierPatientPrecision;
            evenement.Personnel = dto.Personnel ?? evenement.Personnel;
            evenement.PersonnelPrecision = dto.PersonnelPrecision ?? evenement.PersonnelPrecision;
            evenement.Usager = dto.Usager ?? evenement.Usager;
            evenement.UsagerPrecision = dto.UsagerPrecision ?? evenement.UsagerPrecision;
            evenement.Visiteur = dto.Visiteur ?? evenement.Visiteur;
            evenement.VisiteurPrecision = dto.VisiteurPrecision ?? evenement.VisiteurPrecision;
            evenement.MaterielConcerne = dto.MaterielConcerne ?? evenement.MaterielConcerne;
            evenement.MaterielConcernePrecision = dto.MaterielConcernePrecision ?? evenement.MaterielConcernePrecision;
            evenement.AutreElement = dto.AutreElement ?? evenement.AutreElement;
            evenement.AutreElementPrecision = dto.AutreElementPrecision ?? evenement.AutreElementPrecision;
            evenement.Fournisseur = dto.Fournisseur ?? evenement.Fournisseur;
            evenement.FournisseurPrecision = dto.FournisseurPrecision ?? evenement.FournisseurPrecision;

            // Mise à jour des autres propriétés (Nature Soins, Droits, Dossier, etc.)
            evenement.NatureSoinsRetardPEC = dto.NatureSoinsRetardPEC ?? evenement.NatureSoinsRetardPEC;
            evenement.NatureSoinsComplication = dto.NatureSoinsComplication ?? evenement.NatureSoinsComplication;
            evenement.NatureSoinsErreurMedicamenteuse = dto.NatureSoinsErreurMedicamenteuse ?? evenement.NatureSoinsErreurMedicamenteuse;
            evenement.NatureSoinsRetardTraitement = dto.NatureSoinsRetardTraitement ?? evenement.NatureSoinsRetardTraitement;
            evenement.NatureSoinsInfection = dto.NatureSoinsInfection ?? evenement.NatureSoinsInfection;
            evenement.NatureSoinsChutePatient = dto.NatureSoinsChutePatient ?? evenement.NatureSoinsChutePatient;
            evenement.NatureSoinsFugue = dto.NatureSoinsFugue ?? evenement.NatureSoinsFugue;
            evenement.NatureSoinsEscarre = dto.NatureSoinsEscarre ?? evenement.NatureSoinsEscarre;
            evenement.NatureSoinsDefautTransmission = dto.NatureSoinsDefautTransmission ?? evenement.NatureSoinsDefautTransmission;
            evenement.NatureSoinsAutre = dto.NatureSoinsAutre ?? evenement.NatureSoinsAutre;
            evenement.NatureSoinsAutrePrecision = dto.NatureSoinsAutrePrecision ?? evenement.NatureSoinsAutrePrecision;
            

            // --- Partie coordonnateur --- 
            evenement.CausesImmediates = dto.CausesImmediates ?? evenement.CausesImmediates;
            evenement.CausesProfondes = dto.CausesProfondes ?? evenement.CausesProfondes;
            evenement.Evaluation = dto.Evaluation ?? evenement.Evaluation;
            evenement.DateCloture = dto.DateCloture ?? evenement.DateCloture;


            // ... (continuer avec toutes les autres propriétés de la même manière)
            if (dto.ActionsCorrectives != null)
            {
                _context.ActionsCorrectives.RemoveRange(evenement.ActionsCorrectives);
                evenement.ActionsCorrectives = dto.ActionsCorrectives.Select(ac => new ActionCorrective
                {
                    Description = ac.Description,
                    DateEcheance = ac.DateEcheance,
                    EstTerminee = ac.EstTerminee,
                    ResponsableNom = ac.ResponsableNom // ✅ utiliser ResponsableNom
                }).ToList();
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await EvenementExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }
           // DELETE: api/Evenements/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvenement(int id)
        {
            var evenement = await _context.Evenements.FindAsync(id);
            if (evenement == null)
                return NotFound();

            _context.Evenements.Remove(evenement);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> EvenementExists(int id)
        {
            return await _context.Evenements.AnyAsync(e => e.Id == id);
        }

        // Mapper
        private EvenementDto MapToDto(EvenementIndesirable e)
        {
            if (e == null) 
                    throw new ArgumentNullException(nameof(e));


            return new EvenementDto
                {
                    Id = e.Id,
                    Code = e.Code,
                    Type = e.Type,
                    Gravite = e.Gravite,
                Statut = CalculerStatut(e),
                    Description = e.Description,
                    SchemaUrl = e.SchemaUrl,  // <- ajouter cette ligne

                    DateSurvenue = e.DateSurvenue,
                    DateDetection = e.DateDetection,
                    DateDeclaration = e.DateDeclaration,
                    Localisation = e.Localisation,
                    MesureImmediat = e.MesureImmediat,
                    Evitable = e.Evitable,

                    // --- PARTIE COORDONNATEUR ---
                    CausesImmediates = e.CausesImmediates,
                    CausesProfondes = e.CausesProfondes,
                    EvaluationEfficace = e.EvaluationEfficace,
                    EvaluationInefficace = e.EvaluationInefficace,
                    EvaluationDate = e.EvaluationDate,
                    EvaluationResponsable = e.EvaluationResponsable,
                    DateCloture = e.DateCloture,

                    // --- Éléments concernés ---
                    DossierPatient = e.DossierPatient,
                    DossierPatientPrecision = e.DossierPatientPrecision,
                    Personnel = e.Personnel,
                    PersonnelPrecision = e.PersonnelPrecision,
                    Usager = e.Usager,
                    UsagerPrecision = e.UsagerPrecision,
                    Visiteur = e.Visiteur,
                    VisiteurPrecision = e.VisiteurPrecision,
                    Fournisseur = e.Fournisseur,
                    FournisseurPrecision = e.FournisseurPrecision,
                    MaterielConcerne = e.MaterielConcerne,
                    MaterielConcernePrecision = e.MaterielConcernePrecision,
                    AutreElement = e.AutreElement,
                    AutreElementPrecision = e.AutreElementPrecision,

                    // --- Nature Soins ---
                    NatureSoinsRetardPEC = e.NatureSoinsRetardPEC,
                    NatureSoinsComplication = e.NatureSoinsComplication,
                    NatureSoinsErreurMedicamenteuse = e.NatureSoinsErreurMedicamenteuse,
                    NatureSoinsRetardTraitement = e.NatureSoinsRetardTraitement,
                    NatureSoinsInfection = e.NatureSoinsInfection,
                    NatureSoinsChutePatient = e.NatureSoinsChutePatient,
                    NatureSoinsFugue = e.NatureSoinsFugue,
                    NatureSoinsEscarre = e.NatureSoinsEscarre,
                    NatureSoinsDefautTransmission = e.NatureSoinsDefautTransmission,
                    NatureSoinsAutre = e.NatureSoinsAutre,
                    NatureSoinsAutrePrecision = e.NatureSoinsAutrePrecision,

                    // --- Accueil ---
                    NatureAccueilManqueInfo = e.NatureAccueilManqueInfo,
                    NatureAccueilCommViolente = e.NatureAccueilCommViolente,
                    NatureAccueilComportement = e.NatureAccueilComportement,
                    NatureAccueilAbsenceEcoute = e.NatureAccueilAbsenceEcoute,
                    NatureAccueilErreurOrientation = e.NatureAccueilErreurOrientation,
                    NatureAccueilAutre = e.NatureAccueilAutre,
                    NatureAccueilAutrePrecision = e.NatureAccueilAutrePrecision,

                    // --- Droits ---
                    DroitDignite = e.DroitDignite,
                    DroitReligion = e.DroitReligion,
                    DroitInfoAbsente = e.DroitInfoAbsente,
                    DroitAccesDossier = e.DroitAccesDossier,
                    DroitChoixMedecin = e.DroitChoixMedecin,
                    DroitConfidentialite = e.DroitConfidentialite,
                    DroitConsentement = e.DroitConsentement,
                    DroitAutre = e.DroitAutre,
                    DroitAutrePrecision = e.DroitAutrePrecision,

                    // --- Dossier ---
                    DossierPerte = e.DossierPerte,
                    DossierIncomplet = e.DossierIncomplet,
                    DossierInfoManquante = e.DossierInfoManquante,
                    DossierAccesNonAutorise = e.DossierAccesNonAutorise,
                    DossierMalRedige = e.DossierMalRedige,
                    DossierAutre = e.DossierAutre,
                    DossierAutrePrecision = e.DossierAutrePrecision,

                    // --- Transport ---
                    TransportAbsence = e.TransportAbsence,
                    TransportRetard = e.TransportRetard,
                    TransportDefectueux = e.TransportDefectueux,
                    TransportPanne = e.TransportPanne,
                    TransportNonEquipe = e.TransportNonEquipe,
                    TransportCollision = e.TransportCollision,
                    TransportAutre = e.TransportAutre,
                    TransportAutrePrecision = e.TransportAutrePrecision,

                    // --- Risques ---
                    RisqueAES = e.RisqueAES,
                    RisqueInfection = e.RisqueInfection,
                    RisqueMaladiePro = e.RisqueMaladiePro,
                    RisqueChute = e.RisqueChute,
                    RisqueTMS = e.RisqueTMS,
                    RisqueChimique = e.RisqueChimique,
                    RisqueRadioactif = e.RisqueRadioactif,
                    RisquePsycho = e.RisquePsycho,
                    RisqueBlessure = e.RisqueBlessure,
                    RisqueHarcelement = e.RisqueHarcelement,
                    RisqueAutre = e.RisqueAutre,
                    RisqueAutrePrecision = e.RisqueAutrePrecision,

                    // --- Identité ---
                    IdentiteConfusion = e.IdentiteConfusion,
                    IdentiteEchange = e.IdentiteEchange,
                    IdentiteDoublon = e.IdentiteDoublon,
                    IdentiteAutre = e.IdentiteAutre,
                    IdentiteAutrePrecision = e.IdentiteAutrePrecision,

                    // --- Hôtellerie ---
                    HotelChambreSale = e.HotelChambreSale,
                    HotelLingeSale = e.HotelLingeSale,
                    HotelPoubelle = e.HotelPoubelle,
                    HotelLit = e.HotelLit,
                    HotelDouche = e.HotelDouche,
                    HotelAutre = e.HotelAutre,
                    HotelAutrePrecision = e.HotelAutrePrecision,

                    // --- Organisation ---
                    OrgRuptureStock = e.OrgRuptureStock,
                    OrgDefaillanceInfo = e.OrgDefaillanceInfo,
                    OrgInterruptionAppro = e.OrgInterruptionAppro,
                    OrgErreurCommande = e.OrgErreurCommande,
                    OrgGestionStock = e.OrgGestionStock,
                    OrgRetardLivraison = e.OrgRetardLivraison,
                    OrgAutre = e.OrgAutre,
                    OrgAutrePrecision = e.OrgAutrePrecision,

                    // --- Sécurité ---
                    SecuIncendie = e.SecuIncendie,
                    SecuInondation = e.SecuInondation,
                    SecuExplosion = e.SecuExplosion,
                    SecuEffondrement = e.SecuEffondrement,
                    SecuAgression = e.SecuAgression,
                    SecuChantier = e.SecuChantier,
                    SecuAutre = e.SecuAutre,
                    SecuAutrePrecision = e.SecuAutrePrecision,

                    // --- Biens ---
                    BienPerte = e.BienPerte,
                    BienDeterioration = e.BienDeterioration,
                    BienConfusion = e.BienConfusion,
                    BienVol = e.BienVol,
                    BienAutre = e.BienAutre,
                    BienAutrePrecision = e.BienAutrePrecision,

                    // --- Restauration ---
                    RestoIntoxication = e.RestoIntoxication,
                    RestoAvarie = e.RestoAvarie,
                    RestoDegoutant = e.RestoDegoutant,
                    RestoRegime = e.RestoRegime,
                    RestoRetard = e.RestoRetard,
                    RestoVaisselle = e.RestoVaisselle,
                    RestoAutre = e.RestoAutre,
                    RestoAutrePrecision = e.RestoAutrePrecision,

                    // --- Technique ---
                    TechElectricite = e.TechElectricite,
                    TechPlomberie = e.TechPlomberie,
                    TechClimatisation = e.TechClimatisation,
                    TechFluides = e.TechFluides,
                    TechAscenseur = e.TechAscenseur,
                    TechEquipement = e.TechEquipement,
                    TechAutre = e.TechAutre,
                    TechAutrePrecision = e.TechAutrePrecision,

                    // --- Environnement ---
                    EnvPollution = e.EnvPollution,
                    EnvDechets = e.EnvDechets,
                    EnvEau = e.EnvEau,
                    EnvAir = e.EnvAir,
                    EnvOdeur = e.EnvOdeur,
                    EnvAnimaux = e.EnvAnimaux,
                    EnvInsectes = e.EnvInsectes,
                    EnvAutre = e.EnvAutre,
                    EnvAutrePrecision = e.EnvAutrePrecision,

                    // --- Relations ---
                    Declarant = e.Declarant == null ? null : new DeclarantDto
                    {
                        Id = e.Declarant.Id,
                        UserName = e.Declarant.UserName,
                        Email = e.Declarant.Email,
                        Fonction = e.Declarant.Fonction,
                        Tel = e.Declarant.Tel,
                        Service = e.Declarant.Service == null ? null : new ServiceDto
                        {
                            Id = e.Declarant.Service.Id,
                            Nom = e.Declarant.Service.Nom
                        }
                    },
                    Famille = e.Famille == null ? null : new FamilleDto
                    {
                        Id = e.Famille.Id,
                        Nom = e.Famille.Nom
                    },

                    ActionsCorrectives = e.ActionsCorrectives?.Select(ac => new ActionCorrectiveDto
                    {
                        Id = ac.Id,
                        Description = ac.Description,
                        ResponsableNom = ac.ResponsableNom, // ✅ utiliser ResponsableNom
                        DateEcheance = ac.DateEcheance,
                        EstTerminee = ac.EstTerminee
                    }).ToList() ?? new List<ActionCorrectiveDto>()
                };
        }

               // --- Calcul du statut dynamique
        private StatutDeclaration CalculerStatut(EvenementIndesirable incident)
        {
            if (incident.DateCloture != null)
                return StatutDeclaration.Cloture;
            else if (incident.EvaluationDate != null && !string.IsNullOrEmpty(incident.EvaluationResponsable))
                return StatutDeclaration.Resolu;
            else if (incident.ActionsCorrectives != null && incident.ActionsCorrectives.Any())
            {
                bool toutesTerminees = incident.ActionsCorrectives.All(a => a.EstTerminee);
                return toutesTerminees ? StatutDeclaration.Resolu : StatutDeclaration.ActionRequise;
            }
            else if (!string.IsNullOrEmpty(incident.CausesImmediates) || !string.IsNullOrEmpty(incident.CausesProfondes))
                return StatutDeclaration.EnCoursAnalyse;
            else if (incident.Id > 0 && incident.DateDeclaration != null)
                return StatutDeclaration.Soumis;

            return StatutDeclaration.Brouillon;
        }
    }
}