// AuthController.cs
using Microsoft.AspNetCore.Mvc;
using DEI.Models;
using DEI.Data;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Identity;
using DEI.DTOs;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;


[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _config;
    private readonly IPasswordHasher<Utilisateur> _passwordHasher;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        ApplicationDbContext context, 
        IConfiguration config,
        IPasswordHasher<Utilisateur> passwordHasher,
        ILogger<AuthController> logger)
    {
        _context = context;
        _config = config;
        _passwordHasher = passwordHasher;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        try
        {
            _logger.LogInformation("Tentative d'inscription pour {Username}", model.UserName);

            if (await _context.Utilisateurs.AnyAsync(u => u.UserName.ToLower() == model.UserName.ToLower()))
            {
                _logger.LogWarning("Nom d'utilisateur {Username} déjà utilisé", model.UserName);
                return BadRequest(new { Message = "Nom d'utilisateur déjà utilisé" });
            }

            if (await _context.Utilisateurs.AnyAsync(u => u.Email.ToLower() == model.Email.ToLower()))
            {
                _logger.LogWarning("Email {Email} déjà utilisé", model.Email);
                return BadRequest(new { Message = "Email déjà utilisé" });
            }

            var user = new Utilisateur
            {
                Id = Guid.NewGuid().ToString(),
                UserName = model.UserName.Trim(),
                Role = NormalizeRole(model.Role) ?? Role.Declarant.ToString().ToUpper(),
                Email = model.Email.Trim().ToLower(),
                Fonction = model.Fonction?.Trim() ?? "Non défini",
                Tel = model.Tel?.Trim() ?? "00000000",
                ServiceId = model.ServiceId
            };

            user.Password = _passwordHasher.HashPassword(user, model.Password);

            await _context.Utilisateurs.AddAsync(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Utilisateur {Username} créé avec succès", model.UserName);
            return Ok(new { 
                Message = "Utilisateur créé avec succès",
                UserId = user.Id
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de l'inscription");
            return StatusCode(500, new { Message = "Une erreur interne est survenue" });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        try
        {
            var user = await _context.Utilisateurs
                .FirstOrDefaultAsync(u => u.UserName.ToLower() == model.UserName.ToLower());

            if (user == null || _passwordHasher.VerifyHashedPassword(user, user.Password, model.Password) == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { Message = "Identifiants invalides" });
            }

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                Token = token, // <-- Notez le T majuscule
                User = new
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    Role = user.Role
                }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Erreur interne du serveur" });
        }
    }


    private string GenerateJwtToken(Utilisateur user)
    {
        var claims = new[]
        {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id),
        new Claim(JwtRegisteredClaimNames.Name, user.UserName), // Assurez-vous d'inclure le nom d'utilisateur
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role), // Pour la compatibilité avec les systèmes .NET
        new Claim("role", user.Role), // Version simplifiée
           new Claim("fonction", user.Fonction ?? ""),        // ajout fonction
        new Claim("tel", user.Tel ?? ""),                 // ajout téléphone
        new Claim("serviceId", (user.ServiceId?.ToString() ?? "")), // ajout id service
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is not configured")));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expires = DateTime.UtcNow.AddMinutes(
            Convert.ToDouble(_config["Jwt:ExpireMinutes"] ?? "60"));

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string? NormalizeRole(string? role)
    {
        if (string.IsNullOrWhiteSpace(role))
            return null;

        return role.ToUpper() switch
        {
            "ADMIN" => "ADMIN",
            "VALIDATEUR" => "VALIDATEUR",
            "DECLARANT" => "DECLARANT",
            _ => null
        };
    }
}

public class RegisterModel
{
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Role { get; set; }
    public string? Fonction { get; set; }
    public string? Tel { get; set; }
    public int? ServiceId { get; set; }
}

public class LoginModel
{
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}