
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DEI.Models;


namespace DEI.Models
{


    public class AlarmQuestionResponse
    {
        public int Id { get; set; }
        public int QuestionId { get; set; }  // Référence à la question
        public string Categorie { get; set; } = string.Empty;
        public string SousCategorie { get; set; } = string.Empty;
        public string Question { get; set; } = string.Empty;
        public string Reponse { get; set; } = string.Empty;
        public string? Commentaire { get; set; }
        public int AlarmResponseId { get; set; }  // Clé étrangère
        public AlarmResponse? AlarmResponse { get; set; }
    }
}