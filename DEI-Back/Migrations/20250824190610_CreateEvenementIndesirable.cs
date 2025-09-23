using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DEI.Migrations
{
    /// <inheritdoc />
    public partial class CreateEvenementIndesirable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActionsCorrectives_Evenements_EvenementIndesirableId",
                table: "ActionsCorrectives");

            migrationBuilder.DropForeignKey(
                name: "FK_Evenements_FamillesEvenementsIndesirables_FamilleEvenementIndesirableId",
                table: "Evenements");

            migrationBuilder.DropForeignKey(
                name: "FK_Evenements_Services_ServiceId",
                table: "Evenements");

            migrationBuilder.DropForeignKey(
                name: "FK_Evenements_Utilisateurs_DeclarantId",
                table: "Evenements");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Evenements",
                table: "Evenements");

            migrationBuilder.RenameTable(
                name: "Evenements",
                newName: "EvenementIndesirable");

            migrationBuilder.RenameColumn(
                name: "RisqueAutrePrecision",
                table: "EvenementIndesirable",
                newName: "TransportAutrePrecision");

            migrationBuilder.RenameColumn(
                name: "NatureSoinsRetardTraitement",
                table: "EvenementIndesirable",
                newName: "TransportRetard");

            migrationBuilder.RenameColumn(
                name: "NatureSoinsRetardPEC",
                table: "EvenementIndesirable",
                newName: "TransportPanne");

            migrationBuilder.RenameColumn(
                name: "NatureSoinsInfection",
                table: "EvenementIndesirable",
                newName: "TransportNonEquipe");

            migrationBuilder.RenameColumn(
                name: "NatureSoinsFugue",
                table: "EvenementIndesirable",
                newName: "TransportDefectueux");

            migrationBuilder.RenameColumn(
                name: "NatureSoinsEscarre",
                table: "EvenementIndesirable",
                newName: "TransportCollision");

            migrationBuilder.RenameColumn(
                name: "NatureSoinsErreurMedicamenteuse",
                table: "EvenementIndesirable",
                newName: "TransportAutre");

            migrationBuilder.RenameColumn(
                name: "NatureSoinsDefautTransmission",
                table: "EvenementIndesirable",
                newName: "TransportAbsence");

            migrationBuilder.RenameColumn(
                name: "NatureSoinsComplication",
                table: "EvenementIndesirable",
                newName: "SecuInondation");

            migrationBuilder.RenameColumn(
                name: "NatureSoinsChutePatient",
                table: "EvenementIndesirable",
                newName: "SecuIncendie");

            migrationBuilder.RenameColumn(
                name: "NatureSoinsAutrePrecision",
                table: "EvenementIndesirable",
                newName: "OrgAutrePrecision");

            migrationBuilder.RenameColumn(
                name: "NatureSoinsAutre",
                table: "EvenementIndesirable",
                newName: "OrgRuptureStock");

            migrationBuilder.RenameColumn(
                name: "DroitReligion",
                table: "EvenementIndesirable",
                newName: "OrgRetardLivraison");

            migrationBuilder.RenameColumn(
                name: "DroitInfoAbsente",
                table: "EvenementIndesirable",
                newName: "OrgInterruptionAppro");

            migrationBuilder.RenameColumn(
                name: "DroitDignite",
                table: "EvenementIndesirable",
                newName: "OrgGestionStock");

            migrationBuilder.RenameColumn(
                name: "DroitConsentement",
                table: "EvenementIndesirable",
                newName: "OrgErreurCommande");

            migrationBuilder.RenameColumn(
                name: "DroitConfidentialite",
                table: "EvenementIndesirable",
                newName: "OrgDefaillanceInfo");

            migrationBuilder.RenameColumn(
                name: "DroitChoixMedecin",
                table: "EvenementIndesirable",
                newName: "OrgAutre");

            migrationBuilder.RenameColumn(
                name: "DroitAutrePrecision",
                table: "EvenementIndesirable",
                newName: "HotelAutrePrecision");

            migrationBuilder.RenameColumn(
                name: "DroitAutre",
                table: "EvenementIndesirable",
                newName: "HotelPoubelle");

            migrationBuilder.RenameColumn(
                name: "DroitAccesDossier",
                table: "EvenementIndesirable",
                newName: "HotelLit");

            migrationBuilder.RenameIndex(
                name: "IX_Evenements_ServiceId",
                table: "EvenementIndesirable",
                newName: "IX_EvenementIndesirable_ServiceId");

            migrationBuilder.RenameIndex(
                name: "IX_Evenements_FamilleEvenementIndesirableId",
                table: "EvenementIndesirable",
                newName: "IX_EvenementIndesirable_FamilleEvenementIndesirableId");

            migrationBuilder.RenameIndex(
                name: "IX_Evenements_DeclarantId",
                table: "EvenementIndesirable",
                newName: "IX_EvenementIndesirable_DeclarantId");

            migrationBuilder.AddColumn<bool>(
                name: "AutreChamp",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AutreChampPrecision",
                table: "EvenementIndesirable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DescriptionFaits",
                table: "EvenementIndesirable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HotelAutre",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HotelChambreSale",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HotelDouche",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HotelLingeSale",
                table: "EvenementIndesirable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_EvenementIndesirable",
                table: "EvenementIndesirable",
                column: "Id");

            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEHX0eB4L3z5EREMhpWjzZiiKrIuUIa3jmbN0Oh+tau+G5vzQT5XhD1xqWlr5ucP1qg==");

            migrationBuilder.AddForeignKey(
                name: "FK_ActionsCorrectives_EvenementIndesirable_EvenementIndesirableId",
                table: "ActionsCorrectives",
                column: "EvenementIndesirableId",
                principalTable: "EvenementIndesirable",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EvenementIndesirable_FamillesEvenementsIndesirables_FamilleEvenementIndesirableId",
                table: "EvenementIndesirable",
                column: "FamilleEvenementIndesirableId",
                principalTable: "FamillesEvenementsIndesirables",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EvenementIndesirable_Services_ServiceId",
                table: "EvenementIndesirable",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_EvenementIndesirable_Utilisateurs_DeclarantId",
                table: "EvenementIndesirable",
                column: "DeclarantId",
                principalTable: "Utilisateurs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActionsCorrectives_EvenementIndesirable_EvenementIndesirableId",
                table: "ActionsCorrectives");

            migrationBuilder.DropForeignKey(
                name: "FK_EvenementIndesirable_FamillesEvenementsIndesirables_FamilleEvenementIndesirableId",
                table: "EvenementIndesirable");

            migrationBuilder.DropForeignKey(
                name: "FK_EvenementIndesirable_Services_ServiceId",
                table: "EvenementIndesirable");

            migrationBuilder.DropForeignKey(
                name: "FK_EvenementIndesirable_Utilisateurs_DeclarantId",
                table: "EvenementIndesirable");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EvenementIndesirable",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "AutreChamp",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "AutreChampPrecision",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "DescriptionFaits",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "HotelAutre",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "HotelChambreSale",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "HotelDouche",
                table: "EvenementIndesirable");

            migrationBuilder.DropColumn(
                name: "HotelLingeSale",
                table: "EvenementIndesirable");

            migrationBuilder.RenameTable(
                name: "EvenementIndesirable",
                newName: "Evenements");

            migrationBuilder.RenameColumn(
                name: "TransportRetard",
                table: "Evenements",
                newName: "NatureSoinsRetardTraitement");

            migrationBuilder.RenameColumn(
                name: "TransportPanne",
                table: "Evenements",
                newName: "NatureSoinsRetardPEC");

            migrationBuilder.RenameColumn(
                name: "TransportNonEquipe",
                table: "Evenements",
                newName: "NatureSoinsInfection");

            migrationBuilder.RenameColumn(
                name: "TransportDefectueux",
                table: "Evenements",
                newName: "NatureSoinsFugue");

            migrationBuilder.RenameColumn(
                name: "TransportCollision",
                table: "Evenements",
                newName: "NatureSoinsEscarre");

            migrationBuilder.RenameColumn(
                name: "TransportAutrePrecision",
                table: "Evenements",
                newName: "RisqueAutrePrecision");

            migrationBuilder.RenameColumn(
                name: "TransportAutre",
                table: "Evenements",
                newName: "NatureSoinsErreurMedicamenteuse");

            migrationBuilder.RenameColumn(
                name: "TransportAbsence",
                table: "Evenements",
                newName: "NatureSoinsDefautTransmission");

            migrationBuilder.RenameColumn(
                name: "SecuInondation",
                table: "Evenements",
                newName: "NatureSoinsComplication");

            migrationBuilder.RenameColumn(
                name: "SecuIncendie",
                table: "Evenements",
                newName: "NatureSoinsChutePatient");

            migrationBuilder.RenameColumn(
                name: "OrgRuptureStock",
                table: "Evenements",
                newName: "NatureSoinsAutre");

            migrationBuilder.RenameColumn(
                name: "OrgRetardLivraison",
                table: "Evenements",
                newName: "DroitReligion");

            migrationBuilder.RenameColumn(
                name: "OrgInterruptionAppro",
                table: "Evenements",
                newName: "DroitInfoAbsente");

            migrationBuilder.RenameColumn(
                name: "OrgGestionStock",
                table: "Evenements",
                newName: "DroitDignite");

            migrationBuilder.RenameColumn(
                name: "OrgErreurCommande",
                table: "Evenements",
                newName: "DroitConsentement");

            migrationBuilder.RenameColumn(
                name: "OrgDefaillanceInfo",
                table: "Evenements",
                newName: "DroitConfidentialite");

            migrationBuilder.RenameColumn(
                name: "OrgAutrePrecision",
                table: "Evenements",
                newName: "NatureSoinsAutrePrecision");

            migrationBuilder.RenameColumn(
                name: "OrgAutre",
                table: "Evenements",
                newName: "DroitChoixMedecin");

            migrationBuilder.RenameColumn(
                name: "HotelPoubelle",
                table: "Evenements",
                newName: "DroitAutre");

            migrationBuilder.RenameColumn(
                name: "HotelLit",
                table: "Evenements",
                newName: "DroitAccesDossier");

            migrationBuilder.RenameColumn(
                name: "HotelAutrePrecision",
                table: "Evenements",
                newName: "DroitAutrePrecision");

            migrationBuilder.RenameIndex(
                name: "IX_EvenementIndesirable_ServiceId",
                table: "Evenements",
                newName: "IX_Evenements_ServiceId");

            migrationBuilder.RenameIndex(
                name: "IX_EvenementIndesirable_FamilleEvenementIndesirableId",
                table: "Evenements",
                newName: "IX_Evenements_FamilleEvenementIndesirableId");

            migrationBuilder.RenameIndex(
                name: "IX_EvenementIndesirable_DeclarantId",
                table: "Evenements",
                newName: "IX_Evenements_DeclarantId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Evenements",
                table: "Evenements",
                column: "Id");

            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEMxg/WgNt9ClhqP/lWvtuMNHRKsxY1ysWr253zWpMGdh5lX0NYfu3EZgsFfG3HqIQw==");

            migrationBuilder.AddForeignKey(
                name: "FK_ActionsCorrectives_Evenements_EvenementIndesirableId",
                table: "ActionsCorrectives",
                column: "EvenementIndesirableId",
                principalTable: "Evenements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Evenements_FamillesEvenementsIndesirables_FamilleEvenementIndesirableId",
                table: "Evenements",
                column: "FamilleEvenementIndesirableId",
                principalTable: "FamillesEvenementsIndesirables",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Evenements_Services_ServiceId",
                table: "Evenements",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Evenements_Utilisateurs_DeclarantId",
                table: "Evenements",
                column: "DeclarantId",
                principalTable: "Utilisateurs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
