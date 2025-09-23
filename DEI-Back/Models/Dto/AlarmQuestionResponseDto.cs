

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DEI.Models;


namespace DEI.Models.Dto
{
    public class AlarmQuestionResponseDto
    {
        public int QuestionId { get; set; }
        public string Categorie { get; set; } = string.Empty;
        public string SousCategorie { get; set; } = string.Empty;
        public string Question { get; set; } = string.Empty;
        public string Reponse { get; set; } = string.Empty;
        public string? Commentaire { get; set; }
    }
}