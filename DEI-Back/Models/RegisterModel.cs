namespace DEI.Models
{
  public class RegisterModel
{
    public string UserName { get; set; }
    public string Password { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
    public string Fonction { get; set; }
    public string Tel { get; set; }
    public int? ServiceId { get; set; }  // nullable
}
}
