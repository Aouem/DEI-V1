using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DEI.Models;
using DEI.Data;

namespace DEI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FamilleEvenementIndesirableController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FamilleEvenementIndesirableController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/FamilleEvenementIndesirable
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FamilleEvenementIndesirable>>> GetAll()
        {
            return await _context.FamillesEvenements
                .Include(f => f.Evenements)
                .ToListAsync();
        }

        // GET: api/FamilleEvenementIndesirable/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FamilleEvenementIndesirable>> GetById(int id)
        {
            var famille = await _context.FamillesEvenements
                .Include(f => f.Evenements)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (famille == null)
                return NotFound();

            return famille;
        }

        // POST: api/FamilleEvenementIndesirable
        [HttpPost]
        public async Task<ActionResult<FamilleEvenementIndesirable>> Create(FamilleEvenementIndesirable famille)
        {
            _context.FamillesEvenements.Add(famille);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = famille.Id }, famille);
        }

        // PUT: api/FamilleEvenementIndesirable/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, FamilleEvenementIndesirable famille)
        {
            if (id != famille.Id)
                return BadRequest();

            _context.Entry(famille).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.FamillesEvenements.Any(f => f.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/FamilleEvenementIndesirable/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var famille = await _context.FamillesEvenements.FindAsync(id);
            if (famille == null)
                return NotFound();

            _context.FamillesEvenements.Remove(famille);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
