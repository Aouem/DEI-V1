using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DEI.Data;
using DEI.Models;
using DEI.Models.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DEI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActionCorrectiveController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ActionCorrectiveController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ActionCorrective
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActionCorrective>>> GetActions()
        {
            return await _context.ActionsCorrectives.ToListAsync();
        }

        // GET: api/ActionCorrective/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ActionCorrective>> GetAction(int id)
        {
            var action = await _context.ActionsCorrectives.FindAsync(id);

            if (action == null) return NotFound();

            return action;
        }

        // POST: api/ActionCorrective
        [HttpPost]
public async Task<ActionResult<ActionCorrective>> CreateAction(ActionCorrectiveDto actionDto)
{
    var action = new ActionCorrective
    {
        Description = actionDto.Description,
        ResponsableNom = actionDto.ResponsableNom, // ✅ seul champ pour le responsable
        DateEcheance = actionDto.DateEcheance,
        EstTerminee = actionDto.EstTerminee,
        EvenementIndesirableId = actionDto.EvenementIndesirableId
    };

    _context.ActionsCorrectives.Add(action);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetAction), new { id = action.Id }, action);
}

        // PUT: api/ActionCorrective/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAction(int id, ActionCorrectiveDto actionDto) // ⭐ UTILISEZ LE DTO
        {
            if (id != actionDto.Id) return BadRequest();

            var action = await _context.ActionsCorrectives.FindAsync(id);
            if (action == null) return NotFound();

            // ⭐ MAPPAGE MANUEL du DTO vers l'entité existante
         action.Description = actionDto.Description;
action.ResponsableNom = actionDto.ResponsableNom; // ✅ seul champ pour le responsable
action.DateEcheance = actionDto.DateEcheance;
action.EstTerminee = actionDto.EstTerminee;
action.EvenementIndesirableId = actionDto.EvenementIndesirableId;


            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.ActionsCorrectives.Any(a => a.Id == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/ActionCorrective/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAction(int id)
        {
            var action = await _context.ActionsCorrectives.FindAsync(id);
            if (action == null) return NotFound();

            _context.ActionsCorrectives.Remove(action);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}