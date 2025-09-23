// UtilisateurWithServiceDto.cs
using System.ComponentModel.DataAnnotations;

namespace DEI.DTO
{

    public class UtilisateurWithServiceDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public ServiceInfoDto Service { get; set; }
    }

}