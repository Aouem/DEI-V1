namespace DEI.Models
{
    public class AnalyseRisque
    {
        public int Id { get; set; }

        public int EvenementIndesirableId { get; set; }

        public EvenementIndesirable EvenementIndesirable { get; set; } = null!; // On dit au compilateur que ça sera toujours assigné

        public List<FacteurRisque> FacteursRisque { get; set; } = new();

        public string Conclusion { get; set; } = string.Empty;

        public DateTime DateCreation { get; set; } = DateTime.Now;

        public string Createur { get; set; } = string.Empty;
    }
}
