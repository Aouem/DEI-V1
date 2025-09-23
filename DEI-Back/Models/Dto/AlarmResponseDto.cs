
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DEI.Models.Dto // Remplace par ton namespace réel, ex: Formulaire_d_inscription.Models
{

    public class AlarmResponseDto
    {
        public string? CreatedBy { get; set; }
        public List<AlarmQuestionResponseDto> Reponses { get; set; } = new();
    }


}