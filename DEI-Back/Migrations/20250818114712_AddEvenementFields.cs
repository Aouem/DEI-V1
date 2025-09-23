using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DEI.Migrations
{
    /// <inheritdoc />
    public partial class AddEvenementFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AutreElement",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AutreElementPrecision",
                table: "Evenements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "BienAutre",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BienAutrePrecision",
                table: "Evenements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "BienConfusion",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "BienDeterioration",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "BienPerte",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "BienVol",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DossierPatient",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DossierPatientPrecision",
                table: "Evenements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DroitAccesDossier",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DroitAutre",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DroitAutrePrecision",
                table: "Evenements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DroitChoixMedecin",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DroitConfidentialite",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DroitConsentement",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DroitDignite",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DroitInfoAbsente",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DroitReligion",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EnvAir",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EnvAnimaux",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EnvAutre",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EnvAutrePrecision",
                table: "Evenements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EnvDechets",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EnvEau",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EnvInsectes",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EnvOdeur",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EnvPollution",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IdentiteAutre",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdentiteAutrePrecision",
                table: "Evenements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IdentiteDoublon",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "MaterielConcerne",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MaterielConcernePrecision",
                table: "Evenements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureAccueilAbsenceEcoute",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureAccueilAutre",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NatureAccueilAutrePrecision",
                table: "Evenements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureAccueilCommViolente",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureAccueilComportement",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureAccueilErreurOrientation",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureAccueilManqueInfo",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureSoinsAutre",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NatureSoinsAutrePrecision",
                table: "Evenements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureSoinsChutePatient",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureSoinsComplication",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureSoinsDefautTransmission",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureSoinsErreurMedicamenteuse",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureSoinsEscarre",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureSoinsFugue",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureSoinsInfection",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureSoinsRetardPEC",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureSoinsRetardTraitement",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Personnel",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PersonnelPrecision",
                table: "Evenements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RestoAutre",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RestoAutrePrecision",
                table: "Evenements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RestoAvarie",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RestoDegoutant",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RestoIntoxication",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RestoRegime",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RestoRetard",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RestoVaisselle",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RisqueAES",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RisqueAutre",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RisqueAutrePrecision",
                table: "Evenements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RisqueBlessure",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RisqueChimique",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RisqueChute",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RisqueHarcelement",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RisqueInfection",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RisqueMaladiePro",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RisquePsycho",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RisqueRadioactif",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RisqueTMS",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "SecuAgression",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "SecuAutre",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecuAutrePrecision",
                table: "Evenements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "SecuChantier",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "SecuEffondrement",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "SecuExplosion",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "TechAscenseur",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "TechAutre",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TechAutrePrecision",
                table: "Evenements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "TechClimatisation",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "TechElectricite",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "TechEquipement",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "TechFluides",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "TechPlomberie",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Usager",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UsagerPrecision",
                table: "Evenements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Visiteur",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VisiteurPrecision",
                table: "Evenements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEMxg/WgNt9ClhqP/lWvtuMNHRKsxY1ysWr253zWpMGdh5lX0NYfu3EZgsFfG3HqIQw==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AutreElement",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "AutreElementPrecision",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "BienAutre",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "BienAutrePrecision",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "BienConfusion",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "BienDeterioration",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "BienPerte",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "BienVol",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "DossierPatient",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "DossierPatientPrecision",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "DroitAccesDossier",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "DroitAutre",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "DroitAutrePrecision",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "DroitChoixMedecin",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "DroitConfidentialite",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "DroitConsentement",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "DroitDignite",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "DroitInfoAbsente",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "DroitReligion",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "EnvAir",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "EnvAnimaux",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "EnvAutre",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "EnvAutrePrecision",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "EnvDechets",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "EnvEau",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "EnvInsectes",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "EnvOdeur",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "EnvPollution",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "IdentiteAutre",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "IdentiteAutrePrecision",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "IdentiteDoublon",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "MaterielConcerne",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "MaterielConcernePrecision",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "NatureAccueilAbsenceEcoute",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "NatureAccueilAutre",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "NatureAccueilAutrePrecision",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "NatureAccueilCommViolente",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "NatureAccueilComportement",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "NatureAccueilErreurOrientation",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "NatureAccueilManqueInfo",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "NatureSoinsAutre",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "NatureSoinsAutrePrecision",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "NatureSoinsChutePatient",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "NatureSoinsComplication",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "NatureSoinsDefautTransmission",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "NatureSoinsErreurMedicamenteuse",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "NatureSoinsEscarre",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "NatureSoinsFugue",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "NatureSoinsInfection",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "NatureSoinsRetardPEC",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "NatureSoinsRetardTraitement",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "Personnel",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "PersonnelPrecision",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "RestoAutre",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "RestoAutrePrecision",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "RestoAvarie",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "RestoDegoutant",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "RestoIntoxication",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "RestoRegime",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "RestoRetard",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "RestoVaisselle",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "RisqueAES",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "RisqueAutre",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "RisqueAutrePrecision",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "RisqueBlessure",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "RisqueChimique",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "RisqueChute",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "RisqueHarcelement",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "RisqueInfection",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "RisqueMaladiePro",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "RisquePsycho",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "RisqueRadioactif",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "RisqueTMS",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "SecuAgression",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "SecuAutre",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "SecuAutrePrecision",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "SecuChantier",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "SecuEffondrement",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "SecuExplosion",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "TechAscenseur",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "TechAutre",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "TechAutrePrecision",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "TechClimatisation",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "TechElectricite",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "TechEquipement",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "TechFluides",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "TechPlomberie",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "Usager",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "UsagerPrecision",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "Visiteur",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "VisiteurPrecision",
                table: "Evenements");

            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEJSbxeBy19Fdo8x6uzW2ugjrhF47iTHMbXnCgoMRXefoy5FKg3TxI19SuqnxTNgwUg==");
        }
    }
}
