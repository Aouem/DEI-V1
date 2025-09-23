using System;
using System.ComponentModel.DataAnnotations;

namespace DEI.Models
{
    public class ActionCorrectiveDtotest
    {
        [Required]
        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        public DateTime DateEcheance { get; set; }

        public bool EstTerminee { get; set; }

        [Required]
        public string ResponsableId { get; set; }
    }
}