using Microsoft.AspNetCore.Mvc;
using System.IO;
using System;

namespace DEI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PdfController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly IPdfExtractor _pdfExtractor;

        public PdfController(IWebHostEnvironment env, IPdfExtractor pdfExtractor)
        {
            _env = env;
            _pdfExtractor = pdfExtractor;
        }

        [HttpPost("extract")]
        public IActionResult ExtractPdf()
        {
            var pdfPath = Path.Combine(_env.ContentRootPath, "alarm.pdf");
            var outputTxtPath = Path.Combine(_env.ContentRootPath, "questions.txt");

            if (!System.IO.File.Exists(pdfPath))
                return NotFound("Le fichier alarm.pdf est introuvable.");

            try
            {
                _pdfExtractor.Extract(pdfPath, outputTxtPath);
                // Ou si tu veux gérer la sortie texte dans la méthode, sinon tu peux aussi passer outputTxtPath en paramètre
                return Ok($"✅ Extraction terminée. Fichier texte créé à : {outputTxtPath}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "❌ Erreur : " + ex.Message);
            }
        }
        
        [HttpGet("questions")]
public IActionResult GetQuestions()
{
    var outputPath = Path.Combine(_env.ContentRootPath, "questions.txt");

    if (!System.IO.File.Exists(outputPath))
        return NotFound("Fichier questions.txt non trouvé.");

    var questions = System.IO.File.ReadAllLines(outputPath);
    return Ok(questions);
}

    }
}
