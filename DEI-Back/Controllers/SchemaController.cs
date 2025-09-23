using Microsoft.AspNetCore.Mvc;
using DEI.Data;
using DEI.Models;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics; // Ajoutez cette directive

namespace DEI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SchemaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<SchemaController> _logger; // Ajoutez le logger

        public SchemaController(ApplicationDbContext context, IWebHostEnvironment env, ILogger<SchemaController> logger)
        {
            _context = context;
            _env = env;
            _logger = logger; // Initialisez le logger
        }

        // Upload fichier et enregistrement dans la base
        [HttpPost("upload/{evenementId}")]
        public async Task<IActionResult> Upload(int evenementId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Aucun fichier n'a été sélectionné.");

            var evenement = await _context.Evenements.FindAsync(evenementId);
            if (evenement == null)
                return NotFound("Événement non trouvé.");

            try
            {
                var uploadsDir = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsDir))
                    Directory.CreateDirectory(uploadsDir);

                var ext = Path.GetExtension(file.FileName);
                if (string.IsNullOrWhiteSpace(ext))
                    ext = ".jpeg";

                var fileName = $"schema_{evenementId}_{DateTime.Now.Ticks}{ext}";
                var filePath = Path.Combine(uploadsDir, fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(stream);

                var url = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
                evenement.SchemaUrl = url;
                await _context.SaveChangesAsync();

                return Ok(new { message = "✅ Schéma uploadé avec succès", url, fileName, evenementId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'upload du schéma pour l'événement {EvenementId}", evenementId);
                return StatusCode(500, "❌ Erreur lors de l'upload : " + ex.Message);
            }
        }

        // Liste tous les fichiers avec incidentId et dateSurvenue
        [HttpGet("listWithIncident")]
        public async Task<IActionResult> ListWithIncident()
        {
            try
            {
                _logger.LogInformation("Début de ListWithIncident");

                // Vérifiez d'abord si la table existe et contient des données
                var hasData = await _context.Evenements.AnyAsync();
                _logger.LogInformation("Table Evenements existe et contient des données: {HasData}", hasData);

                var evenements = await _context.Evenements
                    .Where(e => !string.IsNullOrEmpty(e.SchemaUrl))
                    .OrderByDescending(e => e.DateSurvenue)
                    .Select(e => new
                    {
                        e.Id,
                        e.DateSurvenue,
                        e.SchemaUrl
                    })
                    .ToListAsync();

                _logger.LogInformation("Nombre d'événements avec schéma: {Count}", evenements.Count);

                var result = evenements
                    .Select((e, index) => new
                    {
                        Id = index + 1,
                        IncidentId = e.Id,
                        DateSurvenue = e.DateSurvenue,
                        SchemaUrl = e.SchemaUrl
                    })
                    .ToList();

                _logger.LogInformation("ListWithIncident terminé avec succès");
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur détaillée dans ListWithIncident");
                return StatusCode(500, $"Erreur lors de la récupération des schémas: {ex.Message}");
            }
        }



        // Liste tous les fichiers dans uploads (ancienne méthode)
        [HttpGet("list")]
        public IActionResult List()
        {
            var uploadsDir = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsDir))
                return Ok(new string[] { });

            var files = Directory.GetFiles(uploadsDir)
                                 .Select(Path.GetFileName)
                                 .ToList();

            return Ok(files);
        }

        // Récupère un fichier par son nom
        [HttpGet("{fileName}")]
        public IActionResult GetFile(string fileName)
        {
            var uploadsDir = Path.Combine(_env.WebRootPath, "uploads");
            var filePath = Path.Combine(uploadsDir, fileName);

            if (!System.IO.File.Exists(filePath))
                return NotFound("❌ Fichier non trouvé.");

            var ext = Path.GetExtension(fileName).ToLower();
            var mimeType = ext switch
            {
                ".png" => "image/png",
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".gif" => "image/gif",
                _ => "application/octet-stream"
            };

            return PhysicalFile(filePath, mimeType, fileName);
        }

        // Supprimer un schéma par l'ID de l'événement
[HttpDelete("{evenementId}")]
public async Task<IActionResult> Delete(int evenementId)
{
    var evenement = await _context.Evenements.FindAsync(evenementId);
    if (evenement == null)
        return NotFound("Événement non trouvé.");

    if (string.IsNullOrEmpty(evenement.SchemaUrl))
        return BadRequest("Aucun schéma associé à cet événement.");

    try
    {
        // Supprimer le fichier physique
        var fileName = Path.GetFileName(new Uri(evenement.SchemaUrl).LocalPath);
        var uploadsDir = Path.Combine(_env.WebRootPath, "uploads");
        var filePath = Path.Combine(uploadsDir, fileName);

        if (System.IO.File.Exists(filePath))
            System.IO.File.Delete(filePath);

        // Supprimer l’URL dans la BDD
        evenement.SchemaUrl = null;
        _context.Entry(evenement).Property(e => e.SchemaUrl).IsModified = true; // force la mise à jour
        await _context.SaveChangesAsync();

        return Ok(new { message = "✅ Schéma supprimé avec succès" });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Erreur lors de la suppression du schéma pour l'événement {EvenementId}", evenementId);
        return StatusCode(500, $"❌ Erreur lors de la suppression : {ex.Message}");
    }
}


    }
}
