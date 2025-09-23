using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DEI.Models
{
    public class Utilisateur
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required(ErrorMessage = "Le nom d'utilisateur est obligatoire")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Le nom d'utilisateur doit contenir entre 3 et 50 caractères")]
        public string UserName { get; set; } = string.Empty;

        [Required(ErrorMessage = "L'email est obligatoire")]
        [EmailAddress(ErrorMessage = "Format d'email invalide")]
        [StringLength(100, ErrorMessage = "L'email ne peut excéder 100 caractères")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le mot de passe est obligatoire")]
        [DataType(DataType.Password)]
        [MinLength(8, ErrorMessage = "Le mot de passe doit contenir au moins 8 caractères")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le rôle est obligatoire")]
        public string Role { get; set; } = string.Empty;

        [ForeignKey(nameof(Service))]
        public int? ServiceId { get; set; }

        public virtual Service? Service { get; set; }

        [Phone(ErrorMessage = "Numéro de téléphone invalide")]
        [StringLength(20, ErrorMessage = "Le numéro de téléphone ne peut excéder 20 caractères")]
        public string? Tel { get; set; } = string.Empty;

        [StringLength(100, ErrorMessage = "La fonction ne peut excéder 100 caractères")]
        public string? Fonction { get; set; } = string.Empty;

        // Navigation properties
        public virtual ICollection<EvenementIndesirable> EvenementsDeclarés { get; set; } = new List<EvenementIndesirable>();
        
        public virtual ICollection<ActionCorrective> ActionsCorrectivesResponsable { get; set; } = new List<ActionCorrective>();
    }
}