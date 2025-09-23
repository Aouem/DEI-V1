using Microsoft.AspNetCore.Mvc;
using DEI.Models; // pour LoginModel, Utilisateur, etc.
using DEI.Data;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;



public class AnalyseRisqueController : Controller
{
    private readonly ApplicationDbContext _context;

    public AnalyseRisqueController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: Analyse pour un événement spécifique
    public IActionResult Creer(int evenementId)
    {
        // Charger les questions de la grille ALARM
        var questions = ChargerGrilleALARM();
        
        var model = new AnalyseRisque
        {
            EvenementIndesirableId = evenementId,
            FacteursRisque = questions.Select(q => new FacteurRisque
            {
                Categorie = q.Categorie,
                SousCategorie = q.SousCategorie,
                Question = q.Question,
                Exemples = q.Exemples
            }).ToList()
        };
        
        return View(model);
    }

    [HttpPost]
    public async Task<IActionResult> Creer(AnalyseRisque analyse)
    {
        if (ModelState.IsValid)
        {
            analyse.Createur = User.Identity.Name;
            _context.Add(analyse);
            await _context.SaveChangesAsync();
            return RedirectToAction("Details", "Evenements", new { id = analyse.EvenementIndesirableId });
        }
        return View(analyse);
    }

    private List<FacteurRisque> ChargerGrilleALARM()
    {
        // Implémentez le chargement des questions depuis:
        // - Une base de données
        // - Un fichier JSON
        // - Un service externe
        
        // Exemple simplifié:
        return new List<FacteurRisque>
        {
            new FacteurRisque
            {
                Categorie = "Facteurs liés au patient",
                SousCategorie = "1.1 Antécédents",
                Question = "Les antécédents médicaux du patient ont-ils influencé le cours de l'événement ?",
                Exemples = "Médicaux, habitus"
            },
            // Ajouter toutes les autres questions...
        };
    }
}