using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DEI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AlarmResponses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlarmResponses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FamillesEvenementsIndesirables",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamillesEvenementsIndesirables", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nom = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Services", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AlarmAnswers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    Categorie = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SousCategorie = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Question = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Reponse = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Commentaire = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AlarmResponseId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlarmAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AlarmAnswers_AlarmResponses_AlarmResponseId",
                        column: x => x.AlarmResponseId,
                        principalTable: "AlarmResponses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Utilisateurs",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ServiceId = table.Column<int>(type: "int", nullable: true),
                    Tel = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Fonction = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Utilisateurs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Utilisateurs_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Evenements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Gravite = table.Column<int>(type: "int", nullable: false),
                    Statut = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    DateSurvenue = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateDetection = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateDeclaration = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Localisation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DeclarantId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MesureImmediat = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    FamilleEvenementIndesirableId = table.Column<int>(type: "int", nullable: false),
                    ServiceId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Evenements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Evenements_FamillesEvenementsIndesirables_FamilleEvenementIndesirableId",
                        column: x => x.FamilleEvenementIndesirableId,
                        principalTable: "FamillesEvenementsIndesirables",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Evenements_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Evenements_Utilisateurs_DeclarantId",
                        column: x => x.DeclarantId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ActionsCorrectives",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    DateEcheance = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EstTerminee = table.Column<bool>(type: "bit", nullable: false),
                    ResponsableId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    EvenementIndesirableId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActionsCorrectives", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ActionsCorrectives_Evenements_EvenementIndesirableId",
                        column: x => x.EvenementIndesirableId,
                        principalTable: "Evenements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ActionsCorrectives_Utilisateurs_ResponsableId",
                        column: x => x.ResponsableId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "FamillesEvenementsIndesirables",
                columns: new[] { "Id", "Nom" },
                values: new object[] { 1, "Default" });

            migrationBuilder.InsertData(
                table: "Services",
                columns: new[] { "Id", "Nom" },
                values: new object[] { 1, "Direction Générale" });

            migrationBuilder.InsertData(
                table: "Utilisateurs",
                columns: new[] { "Id", "Email", "Fonction", "Password", "Role", "ServiceId", "Tel", "UserName" },
                values: new object[] { "1", "admin@example.com", "Administrateur", "AQAAAAIAAYagAAAAED5Ln034nf+Y8SBQK6ODKao953qvvfvnNwePEquXT2FTSBT2iz7DM+3gEDg9xcuAwQ==", "ADMIN", 1, "12345678", "admin" });

            migrationBuilder.CreateIndex(
                name: "IX_ActionsCorrectives_EvenementIndesirableId",
                table: "ActionsCorrectives",
                column: "EvenementIndesirableId");

            migrationBuilder.CreateIndex(
                name: "IX_ActionsCorrectives_ResponsableId",
                table: "ActionsCorrectives",
                column: "ResponsableId");

            migrationBuilder.CreateIndex(
                name: "IX_AlarmAnswers_AlarmResponseId",
                table: "AlarmAnswers",
                column: "AlarmResponseId");

            migrationBuilder.CreateIndex(
                name: "IX_Evenements_DeclarantId",
                table: "Evenements",
                column: "DeclarantId");

            migrationBuilder.CreateIndex(
                name: "IX_Evenements_FamilleEvenementIndesirableId",
                table: "Evenements",
                column: "FamilleEvenementIndesirableId");

            migrationBuilder.CreateIndex(
                name: "IX_Evenements_ServiceId",
                table: "Evenements",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_Services_Nom",
                table: "Services",
                column: "Nom",
                unique: true,
                filter: "[Nom] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Utilisateurs_Email",
                table: "Utilisateurs",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Utilisateurs_ServiceId",
                table: "Utilisateurs",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_Utilisateurs_UserName",
                table: "Utilisateurs",
                column: "UserName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActionsCorrectives");

            migrationBuilder.DropTable(
                name: "AlarmAnswers");

            migrationBuilder.DropTable(
                name: "Evenements");

            migrationBuilder.DropTable(
                name: "AlarmResponses");

            migrationBuilder.DropTable(
                name: "FamillesEvenementsIndesirables");

            migrationBuilder.DropTable(
                name: "Utilisateurs");

            migrationBuilder.DropTable(
                name: "Services");
        }
    }
}
