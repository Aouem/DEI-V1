using System;

namespace DEI.Models.Dto
{
  public class ActionCorrectiveDto
{
    public int Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public string ResponsableNom { get; set; } = string.Empty; // Nom saisi
    public DateTime DateEcheance { get; set; }
    public bool EstTerminee { get; set; }
    public int EvenementIndesirableId { get; set; }
}


}