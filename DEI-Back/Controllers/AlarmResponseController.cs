using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DEI.Data;
using DEI.Models;

namespace DEI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlarmResponseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AlarmResponseController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/AlarmResponse
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AlarmResponse>>> GetAll()
        {
            var responses = await _context.AlarmResponses
                .Include(ar => ar.Reponses)
                .ToListAsync();

            return Ok(responses);
        }

        // GET: api/AlarmResponse/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AlarmResponse>> GetById(int id)
        {
            var response = await _context.AlarmResponses
                .Include(ar => ar.Reponses)
                .FirstOrDefaultAsync(ar => ar.Id == id);

            if (response == null) return NotFound();

            return Ok(response);
        }

        // POST: api/AlarmResponse
        [HttpPost]
        public async Task<ActionResult<AlarmResponse>> Create([FromBody] AlarmResponse newResponse)
        {
            if (newResponse == null || newResponse.Reponses == null)
                return BadRequest("La réponse ou ses sous-réponses sont nulles.");

            newResponse.CreatedAt = DateTime.UtcNow;

            _context.AlarmResponses.Add(newResponse);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = newResponse.Id }, newResponse);
        }

        // DELETE: api/AlarmResponse/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _context.AlarmResponses.FindAsync(id);
            if (response == null) return NotFound();

            _context.AlarmResponses.Remove(response);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
