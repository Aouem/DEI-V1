// Models/Dto/SchemaDto.cs
namespace DEI.Models.Dto
{
    public class SchemaDto
    {
        public int Id { get; set; }                // Id du schéma
        public int IncidentId { get; set; }        // Id de l'incident
        public DateTime DateSurvenue { get; set; } // Date de survenue de l'incident
        public string? SchemaUrl { get; set; }      // URL de l'image
    }
}
