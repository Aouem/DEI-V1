using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DEI.Data;
using DEI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DEI.Models.Dto;


namespace DEI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ServicesController(ApplicationDbContext context)
        {
            _context = context;
        }

       
     

        public class CreateServiceDto
        {
            public string? Nom { get; set; }
        }

        public class UpdateServiceDto
        {
            public string? Nom { get; set; }
        }

        // GET: api/Services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetServices()
        {
            return await _context.Services
                .Select(s => new ServiceDto
                {
                    Id = s.Id,
                    Nom = s.Nom
                })
                .ToListAsync();
        }

        // GET: api/Services/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceDto>> GetService(int id)
        {
            var service = await _context.Services
                .Where(s => s.Id == id)
                .Select(s => new ServiceDto
                {
                    Id = s.Id,
                    Nom = s.Nom
                })
                .FirstOrDefaultAsync();

            if (service == null)
            {
                return NotFound();
            }

            return service;
        }

        // POST: api/Services
        [HttpPost]
        public async Task<ActionResult<ServiceDto>> CreateService(CreateServiceDto createDto)
        {
            // Validation
            if (string.IsNullOrWhiteSpace(createDto.Nom))
            {
                ModelState.AddModelError(nameof(createDto.Nom), "Le nom du service est obligatoire");
                return BadRequest(ModelState);
            }

            // Vérification doublon (insensible à la casse)
            var normalizedNom = createDto.Nom.Trim().ToLower();
            if (await _context.Services.AnyAsync(s => s.Nom.Trim().ToLower() == normalizedNom))
            {
                return Conflict($"Un service avec le nom '{createDto.Nom}' existe déjà");
            }

            // Création
            var service = new Service
            {
                Nom = createDto.Nom.Trim()
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            var serviceDto = new ServiceDto
            {
                Id = service.Id,
                Nom = service.Nom
            };

            return CreatedAtAction(nameof(GetService), new { id = service.Id }, serviceDto);
        }

        // PUT: api/Services/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(int id, UpdateServiceDto updateDto)
        {
            // Validation
            if (string.IsNullOrWhiteSpace(updateDto.Nom))
            {
                ModelState.AddModelError(nameof(updateDto.Nom), "Le nom du service est obligatoire");
                return BadRequest(ModelState);
            }

            var service = await _context.Services.FindAsync(id);
            if (service == null)
            {
                return NotFound();
            }

            // Vérification doublon (excluant l'entité actuelle)
            var normalizedNom = updateDto.Nom.Trim().ToLower();
            if (await _context.Services
                .AnyAsync(s => s.Id != id && s.Nom.Trim().ToLower() == normalizedNom))
            {
                return Conflict($"Un service avec le nom '{updateDto.Nom}' existe déjà");
            }

            // Mise à jour
            service.Nom = updateDto.Nom.Trim();
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Services/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _context.Services
                .Include(s => s.Utilisateurs)
                .Include(s => s.Evenements)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (service == null)
            {
                return NotFound();
            }

            // Vérification des relations avant suppression
            if (service.Utilisateurs.Any() || service.Evenements.Any())
            {
                return BadRequest("Impossible de supprimer ce service car il est associé à des utilisateurs ou événements");
            }

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ServiceExists(int id)
        {
            return _context.Services.Any(e => e.Id == id);
        }
    }
}