using System.ComponentModel.DataAnnotations;

namespace DEI.DTOs
{
    public class UtilisateurDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Tel { get; set; } = string.Empty;
        public string Fonction { get; set; } = string.Empty;
        public int? ServiceId { get; set; }
    }

    public class CreateUtilisateurDto
    {
        [Required]
        [StringLength(50)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 8)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$",
            ErrorMessage = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre")]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = string.Empty;

        [Phone]
        public string Tel { get; set; } = string.Empty;

        public string Fonction { get; set; } = string.Empty;

        public int? ServiceId { get; set; }
    }

    public class LoginDto
    {
        [Required]
        public string UserName { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
