using System.ComponentModel.DataAnnotations;

public class FacteurRisque
{
    public int Id { get; set; }

    [Required]
    public string Categorie { get; set; } = string.Empty; // obligatoire, pas nullable

    [Required]
    public string SousCategorie { get; set; } = string.Empty; // obligatoire, pas nullable

    [Required]
    public string Question { get; set; } = string.Empty; // obligatoire, pas nullable

    public string? Exemples { get; set; } // optionnel, nullable

    public string? Reponse { get; set; } // réponse utilisateur, optionnelle au départ

    public string? Analyse { get; set; } // analyse du risque, optionnelle au départ
}
