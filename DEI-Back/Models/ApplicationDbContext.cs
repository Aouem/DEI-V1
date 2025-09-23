using Microsoft.EntityFrameworkCore;
using DEI.Models;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace DEI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
   
   

        public DbSet<Utilisateur> Utilisateurs { get; set; }
        public DbSet<EvenementIndesirable> Evenements { get; set; }
        public DbSet<ActionCorrective> ActionsCorrectives { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<FamilleEvenementIndesirable> FamillesEvenements { get; set; }
        public DbSet<AlarmResponse> AlarmResponses { get; set; }
        public DbSet<AlarmAnswer> AlarmAnswers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuration Utilisateur
            modelBuilder.Entity<Utilisateur>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
                entity.HasIndex(u => u.UserName).IsUnique();
                
                entity.HasOne(u => u.Service)
                    .WithMany(s => s.Utilisateurs)
                    .HasForeignKey(u => u.ServiceId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(u => u.EvenementsDeclarés)
                    .WithOne(e => e.Declarant)
                    .HasForeignKey(e => e.DeclarantId)
                    .OnDelete(DeleteBehavior.Restrict);

              
            });

            // Configuration EvenementIndesirable
            modelBuilder.Entity<EvenementIndesirable>(entity =>
            {
                entity.HasOne(e => e.Declarant)
                    .WithMany(u => u.EvenementsDeclarés)
                    .HasForeignKey(e => e.DeclarantId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Famille)
                    .WithMany(f => f.Evenements)
                    .HasForeignKey(e => e.FamilleEvenementIndesirableId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .IsRequired();

                entity.HasMany(e => e.ActionsCorrectives)
                    .WithOne(a => a.EvenementIndesirable)
                    .HasForeignKey(a => a.EvenementIndesirableId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

           
            // Configuration Service
            modelBuilder.Entity<Service>(entity =>
            {
                entity.HasIndex(s => s.Nom).IsUnique();
                
                entity.HasMany(s => s.Utilisateurs)
                    .WithOne(u => u.Service)
                    .HasForeignKey(u => u.ServiceId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configuration FamilleEvenementIndesirable
            modelBuilder.Entity<FamilleEvenementIndesirable>(entity =>
            {
                entity.HasMany(f => f.Evenements)
                    .WithOne(e => e.Famille)
                    .HasForeignKey(e => e.FamilleEvenementIndesirableId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configuration Alarm
            modelBuilder.Entity<AlarmResponse>()
                .HasMany(r => r.Reponses)
                .WithOne(a => a.AlarmResponse)
                .HasForeignKey(a => a.AlarmResponseId)
                .OnDelete(DeleteBehavior.Cascade);

            // Données initiales avec hachage valide
            var passwordHasher = new PasswordHasher<Utilisateur>();
            var adminUser = new Utilisateur 
            { 
                Id = "1",
                UserName = "admin",
                Email = "admin@example.com",
                Role = "ADMIN", // Rôle en majuscules pour la cohérence
                Fonction = "Administrateur",
                Tel = "12345678",
                ServiceId = 1
            };
            adminUser.Password = passwordHasher.HashPassword(adminUser, "Admin123!"); // Mot de passe fort

            modelBuilder.Entity<FamilleEvenementIndesirable>().HasData(
                new FamilleEvenementIndesirable { Id = 1, Nom = "Default" }
            );

            modelBuilder.Entity<Service>().HasData(
                new Service { Id = 1, Nom = "Direction Générale" }
            );

            modelBuilder.Entity<Utilisateur>().HasData(adminUser);
        }
    }
}