using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DEI.Models;
using DEI.Data;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using DEI.DTOs;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace DEI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UtilisateurController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UtilisateurController> _logger;
        private readonly IPasswordHasher<Utilisateur> _passwordHasher;
        private readonly IConfiguration _config;

        public UtilisateurController(
            ApplicationDbContext context,
            ILogger<UtilisateurController> logger,
            IPasswordHasher<Utilisateur> passwordHasher,
            IConfiguration config)
        {
            _context = context;
            _logger = logger;
            _passwordHasher = passwordHasher;
            _config = config;
        }

        // =========================
        // 🔹 GET: Tous les utilisateurs
        // =========================
        [HttpGet]
        public ActionResult<IEnumerable<UtilisateurDto>> GetUtilisateurs()
        {
            return _context.Utilisateurs
                .Select(u => new UtilisateurDto
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    Email = u.Email,
                    Role = u.Role,
                    Tel = u.Tel,
                    Fonction = u.Fonction,
                    ServiceId = u.ServiceId
                })
                .ToList();
        }

        // =========================
        // 🔹 GET: Un utilisateur par Id
        // =========================
        [HttpGet("{id}")]
        public ActionResult<Utilisateur> GetUtilisateur(string id)
        {
            var utilisateur = _context.Utilisateurs.Find(id);
            if (utilisateur == null)
                return NotFound();

            return utilisateur;
        }

        // =========================
        // 🔹 POST: Créer un utilisateur
        // =========================
     // POST: api/utilisateur (Inscription)
[HttpPost]
public async Task<ActionResult<UtilisateurDto>> CreateUtilisateur([FromBody] RegisterModel utilisateurModel)
{
    if (!ModelState.IsValid)
    {
        var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
        return BadRequest(new { Message = "Erreurs de validation", Errors = errors });
    }

    if (!Enum.TryParse(utilisateurModel.Role, true, out Role role))
    {
        return BadRequest(new
        {
            Message = "Rôle invalide",
            ValidRoles = Enum.GetNames(typeof(Role))
        });
    }

    var exists = await _context.Utilisateurs
        .AnyAsync(u => u.Email == utilisateurModel.Email || u.UserName == utilisateurModel.UserName);

    if (exists)
        return Conflict("Cet utilisateur existe déjà.");

    if (utilisateurModel.ServiceId.HasValue &&
        !await _context.Services.AnyAsync(s => s.Id == utilisateurModel.ServiceId.Value))
    {
        return BadRequest(new
        {
            Message = "Service introuvable",
            ServiceId = utilisateurModel.ServiceId.Value
        });
    }

    if (!IsPasswordValid(utilisateurModel.Password))
    {
        return BadRequest(new
        {
            Message = "Le mot de passe doit contenir :\n" +
                      "- 8 caractères minimum\n" +
                      "- Au moins une majuscule\n" +
                      "- Au moins une minuscule\n" +
                      "- Au moins un chiffre",
            Code = "WEAK_PASSWORD"
        });
    }

    var utilisateur = new Utilisateur
    {
        UserName = utilisateurModel.UserName.Trim(),
        Email = utilisateurModel.Email.Trim().ToLower(),
        Role = utilisateurModel.Role,
        Tel = utilisateurModel.Tel?.Trim(),
        Fonction = utilisateurModel.Fonction?.Trim(),
        ServiceId = utilisateurModel.ServiceId
    };

    utilisateur.Password = _passwordHasher.HashPassword(utilisateur, utilisateurModel.Password);

    try
    {
        await _context.Utilisateurs.AddAsync(utilisateur);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUtilisateur),
            new { id = utilisateur.Id },
            MapToDto(utilisateur));
    }
    catch (DbUpdateException ex)
    {
        _logger.LogError(ex, "Erreur DB pour l'utilisateur {Email}", utilisateurModel.Email);
        return StatusCode(500, new { Message = "Erreur serveur lors de la création" });
    }
}

        // =========================
        // 🔹 POST: Login
        // =========================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var utilisateur = await _context.Utilisateurs
                .FirstOrDefaultAsync(u => u.UserName.ToLower() == loginDto.UserName.ToLower());

            if (utilisateur == null)
                return Unauthorized(new { Message = "Nom d'utilisateur ou mot de passe incorrect", Code = "AUTH_FAILED" });

            var verificationResult = _passwordHasher.VerifyHashedPassword(
                utilisateur,
                utilisateur.Password,
                loginDto.Password);

            if (verificationResult == PasswordVerificationResult.Failed)
                return Unauthorized(new { Message = "Nom d'utilisateur ou mot de passe incorrect", Code = "AUTH_FAILED" });

            var token = GenerateJwtToken(utilisateur);

            return Ok(new
            {
                Token = token,
                User = MapToDto(utilisateur),
                ExpiresIn = 3600
            });
        }

        // =========================
        // 🔹 PUT: Mettre à jour un utilisateur
        // =========================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUtilisateur(string id, [FromBody] RegisterModel dto)
        {
            var utilisateur = await _context.Utilisateurs.FindAsync(id);
            if (utilisateur == null)
                return NotFound();

            utilisateur.UserName = dto.UserName ?? utilisateur.UserName;
            utilisateur.Email = dto.Email ?? utilisateur.Email;
            utilisateur.Role = dto.Role ?? utilisateur.Role;
            utilisateur.Tel = dto.Tel ?? utilisateur.Tel;
            utilisateur.Fonction = dto.Fonction ?? utilisateur.Fonction;
            utilisateur.ServiceId = dto.ServiceId ?? utilisateur.ServiceId;

            try
            {
                _context.Utilisateurs.Update(utilisateur);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Erreur lors de la modification de l'utilisateur {Id}", id);
                return StatusCode(500, new { Message = "Erreur serveur lors de la mise à jour" });
            }
        }

        // =========================
        // 🔹 DELETE: Supprimer un utilisateur
        // =========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUtilisateur(string id)
        {
            var utilisateur = await _context.Utilisateurs.FindAsync(id);
            if (utilisateur == null)
                return NotFound();

            try
            {
                _context.Utilisateurs.Remove(utilisateur);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Erreur lors de la suppression de l'utilisateur {Id}", id);
                return StatusCode(500, new { Message = "Erreur serveur lors de la suppression" });
            }
        }

        // =========================
        // 🔹 Méthodes internes
        // =========================
        private string GenerateJwtToken(Utilisateur user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Name, user.UserName),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key non configurée")));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expires = DateTime.UtcNow.AddHours(1);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool IsPasswordValid(string password)
        {
            return !string.IsNullOrWhiteSpace(password)
                   && password.Length >= 8
                   && password.Any(char.IsUpper)
                   && password.Any(char.IsLower)
                   && password.Any(char.IsDigit);
        }

        private UtilisateurDto MapToDto(Utilisateur user) => new()
        {
            Id = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            Role = user.Role,
            Tel = user.Tel,
            Fonction = user.Fonction,
            ServiceId = user.ServiceId
        };
    }
}
