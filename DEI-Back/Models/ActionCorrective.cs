using System;
using System.ComponentModel.DataAnnotations;

namespace DEI.Models
{
    public class ActionCorrective
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "La description est obligatoire")]
        [StringLength(1000, ErrorMessage = "La description ne peut excéder 1000 caractères")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "La date d'échéance est obligatoire")]
        public DateTime DateEcheance { get; set; }

        public bool EstTerminee { get; set; }

        // ✅ Responsable saisi librement (pas FK)
        [Required(ErrorMessage = "Le responsable est obligatoire")]
        public string ResponsableNom { get; set; } = string.Empty;

        [Required(ErrorMessage = "L'événement associé est obligatoire")]
        public int EvenementIndesirableId { get; set; }

        // ⚠️ Lien vers l'événement
        public EvenementIndesirable EvenementIndesirable { get; set; } = null!;

        // Méthode utile pour savoir si l'action est en retard
        public bool EstEnRetard()
        {
            return !EstTerminee && DateEcheance < DateTime.Now;
        }
    }
}
