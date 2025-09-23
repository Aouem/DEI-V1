using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DEI.Models // Remplace par ton namespace réel, ex: Formulaire_d_inscription.Models
{
    public class AlarmResponse
    {
        public int Id { get; set; }

        public List<AlarmAnswer> Reponses { get; set; } = new();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


    }
}