using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace DEI.Models
{
    public class FamilleEvenementIndesirable
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string? Nom { get; set; }  // ex : "Chute", "Erreur de médication", etc.

        public virtual ICollection<EvenementIndesirable> Evenements { get; set; } = new List<EvenementIndesirable>();
    }
}
