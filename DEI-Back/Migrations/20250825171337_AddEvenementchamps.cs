using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DEI.Migrations
{
    /// <inheritdoc />
    public partial class AddEvenementchamps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AutreChampPrecision",
                table: "EvenementIndesirable",
                newName: "RisqueAutrePrecision");

            migrationBuilder.RenameColumn(
                name: "AutreChamp",
                table: "EvenementIndesirable",
                newName: "NatureSoinsRetardTraitement");

            migrationBuilder.AddColumn<bool>(
                name: "DossierAccesNonAutorise",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DossierAutre",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DossierAutrePrecision",
                table: "EvenementIndesirable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DossierIncomplet",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DossierInfoManquante",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DossierMalRedige",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DossierPerte",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DroitAccesDossier",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DroitAutre",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DroitAutrePrecision",
                table: "EvenementIndesirable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DroitChoixMedecin",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DroitConfidentialite",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DroitConsentement",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DroitDignite",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DroitInfoAbsente",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DroitReligion",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IdentiteConfusion",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IdentiteEchange",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureSoinsAutre",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NatureSoinsAutrePrecision",
                table: "EvenementIndesirable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureSoinsChutePatient",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureSoinsComplication",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureSoinsDefautTransmission",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureSoinsErreurMedicamenteuse",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureSoinsEscarre",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureSoinsFugue",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureSoinsInfection",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NatureSoinsRetardPEC",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEEx+TyFqaFRJFdy4pVDO7fJxmVtfF/0q4L+lPoOZzNeWN97ul5/R3dQU1OU49acBAw==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DossierAccesNonAutorise",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "DossierAutre",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "DossierAutrePrecision",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "DossierIncomplet",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "DossierInfoManquante",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "DossierMalRedige",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "DossierPerte",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "DroitAccesDossier",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "DroitAutre",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "DroitAutrePrecision",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "DroitChoixMedecin",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "DroitConfidentialite",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "DroitConsentement",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "DroitDignite",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "DroitInfoAbsente",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "DroitReligion",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "IdentiteConfusion",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "IdentiteEchange",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "NatureSoinsAutre",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "NatureSoinsAutrePrecision",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "NatureSoinsChutePatient",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "NatureSoinsComplication",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "NatureSoinsDefautTransmission",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "NatureSoinsErreurMedicamenteuse",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "NatureSoinsEscarre",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "NatureSoinsFugue",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "NatureSoinsInfection",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "NatureSoinsRetardPEC",
                table: "EvenementIndesirable");

            migrationBuilder.RenameColumn(
                name: "RisqueAutrePrecision",
                table: "EvenementIndesirable",
                newName: "AutreChampPrecision");

            migrationBuilder.RenameColumn(
                name: "NatureSoinsRetardTraitement",
                table: "EvenementIndesirable",
                newName: "AutreChamp");

            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEHX0eB4L3z5EREMhpWjzZiiKrIuUIa3jmbN0Oh+tau+G5vzQT5XhD1xqWlr5ucP1qg==");
        }
    }
}
