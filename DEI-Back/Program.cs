// Program.cs
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;
using DEI.Data;
using DEI.Models;
using Microsoft.AspNetCore.Identity;
using AV = Asp.Versioning;
using System.Text.Json;
using Microsoft.Extensions.FileProviders;


var builder = WebApplication.CreateBuilder(args);

#region 1. Configuration JWT
var jwtSettings = builder.Configuration.GetSection("Jwt");
builder.Services.Configure<JwtSettings>(jwtSettings);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
        ClockSkew = TimeSpan.Zero
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"Authentication failed: {context.Exception.Message}");
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("Token validated successfully");
            return Task.CompletedTask;
        }
    };
});
#endregion

#region 2. Autorisation
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("ADMIN"));
    options.AddPolicy("ValidateurOrAdmin", policy => policy.RequireRole("VALIDATEUR", "ADMIN"));
    options.AddPolicy("DeclarantOrHigher", policy => policy.RequireRole("DECLARANT", "VALIDATEUR", "ADMIN"));
});
#endregion

#region 3. Swagger avec JWT
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.CustomSchemaIds(type => type.FullName); // Utilise le nom complet avec namespace
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "DEI API", Version = "v1" });

    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Entrez 'Bearer {votre_token}'",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = JwtBearerDefaults.AuthenticationScheme
        }
    };

    c.AddSecurityDefinition(securityScheme.Reference.Id, securityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { securityScheme, Array.Empty<string>() }
    });
});
#endregion

#region 4. CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
#endregion

#region 5. Base de données
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure());

    if (builder.Environment.IsDevelopment())
    {
        options.EnableDetailedErrors();
        options.EnableSensitiveDataLogging();
    }
});
#endregion

#region 6. Controllers & JSON
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

#endregion

#region 7. Services
builder.Services.AddSingleton<IPasswordHasher<Utilisateur>, PasswordHasher<Utilisateur>>();
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>()
    .AddSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
#endregion

#region 8. Versioning
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new AV.ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
});
#endregion

var app = builder.Build();

#region 9. Pipeline
// Swagger dispo en Dev ET Prod
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "DEI API v1");
    c.RoutePrefix = "swagger"; // accessible via /swagger
});

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles(); // permet de servir wwwroot


// 9bis. Servir le dossier wwwroot/uploads pour les fichiers uploadés
var uploadsPath = Path.Combine(app.Environment.WebRootPath ?? "wwwroot", "uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});



app.MapControllers();
app.MapHealthChecks("/health");
#endregion

#region 10. Seed Data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        var hasher = services.GetRequiredService<IPasswordHasher<Utilisateur>>();

        await context.Database.MigrateAsync();
        await SeedData.InitializeAsync(context, hasher);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Erreur lors de l'initialisation de la base de données");
    }
}
#endregion

await app.RunAsync();

#region 11. Classes internes
public class JwtSettings
{
    public string Key { get; set; } = default!;
    public string Issuer { get; set; } = default!;
    public string Audience { get; set; } = default!;
    public int ExpireMinutes { get; set; } = 60;
}

public static class SeedData
{
    public static async Task InitializeAsync(ApplicationDbContext context, IPasswordHasher<Utilisateur> passwordHasher)
    {
        // --- Services ---
        var servicesToAdd = new List<Service>
        {
            new Service { Nom = "Direction Générale" },
            new Service { Nom = "Ressources Humaines" },
            new Service { Nom = "Service Qualité" }
        };

        foreach (var service in servicesToAdd)
        {
            if (!await context.Services.AnyAsync(s => s.Nom == service.Nom))
            {
                await context.Services.AddAsync(service);
            }
        }

        await context.SaveChangesAsync();

        // Récupérer les services existants
        var directionGenerale = await context.Services.FirstAsync(s => s.Nom == "Direction Générale");
        var ressourcesHumaines = await context.Services.FirstAsync(s => s.Nom == "Ressources Humaines");
        var serviceQualite = await context.Services.FirstAsync(s => s.Nom == "Service Qualité");

        // --- Utilisateurs ---
        var utilisateursToAdd = new List<Utilisateur>
        {
            new Utilisateur
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "admin",
                Email = "admin@dei.com",
                Role = "ADMIN",
                Fonction = "Administrateur",
                Tel = "12345678",
                ServiceId = directionGenerale.Id,
                Password = passwordHasher.HashPassword(null!, "Admin123!")
            },
            new Utilisateur
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "validateur",
                Email = "validateur@dei.com",
                Role = "VALIDATEUR",
                Fonction = "Responsable qualité",
                Tel = "87654321",
                ServiceId = serviceQualite.Id,
                Password = passwordHasher.HashPassword(null!, "Validateur123!")
            }
        };

        foreach (var user in utilisateursToAdd)
        {
            if (!await context.Utilisateurs.AnyAsync(u => u.UserName == user.UserName))
            {
                await context.Utilisateurs.AddAsync(user);
            }
        }

        await context.SaveChangesAsync();

        // --- Familles d'événements indésirables ---
        var famillesEvenements = new List<FamilleEvenementIndesirable>
        {
            new FamilleEvenementIndesirable { Nom = "Chute" },
            new FamilleEvenementIndesirable { Nom = "Erreur de médication" },
            new FamilleEvenementIndesirable { Nom = "Réaction allergique" },
            new FamilleEvenementIndesirable { Nom = "Infection nosocomiale" },
            new FamilleEvenementIndesirable { Nom = "Problème technique/équipement" },
            new FamilleEvenementIndesirable { Nom = "Erreur administrative" },
            new FamilleEvenementIndesirable { Nom = "Autre" }
        };

        var famillesToAdd = famillesEvenements
            .Where(f => !context.FamillesEvenements.Any(existing => existing.Nom == f.Nom))
            .ToList();

        if (famillesToAdd.Any())
        {
            await context.FamillesEvenements.AddRangeAsync(famillesToAdd);
            await context.SaveChangesAsync();
        }
    }
}




#endregion
