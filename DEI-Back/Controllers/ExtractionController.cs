using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace DEI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExtractionController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly IPdfExtractor _pdfExtractor;

        public ExtractionController(IWebHostEnvironment env, IPdfExtractor pdfExtractor)
        {
            _env = env;
            _pdfExtractor = pdfExtractor;
        }

        [HttpGet("extract")]
        public IActionResult Extract()
        {
            var pdfPath = Path.Combine(_env.ContentRootPath, "alarm.pdf");
            var outputPath = Path.Combine(_env.ContentRootPath, "questions.txt");

            if (!System.IO.File.Exists(pdfPath))
                return NotFound("Le fichier PDF est introuvable.");

            try
            {
                _pdfExtractor.Extract(pdfPath, outputPath);
                return Ok("✅ Extraction terminée.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"❌ Erreur : {ex.Message}");
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
