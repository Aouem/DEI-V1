using DEI.Models;

namespace DEI.Models
{
    public class Service
    {
        public int Id { get; set; }
        public string? Nom { get; set; }
        
        public ICollection<Utilisateur> Utilisateurs { get; set; } = new List<Utilisateur>();
        public ICollection<EvenementIndesirable> Evenements { get; set; } = new List<EvenementIndesirable>();
    }
}
