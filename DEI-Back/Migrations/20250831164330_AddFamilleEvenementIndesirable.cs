using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DEI.Migrations
{
    /// <inheritdoc />
    public partial class AddFamilleEvenementIndesirable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                name: "PK_FamillesEvenementsIndesirables",
                table: "FamillesEvenementsIndesirables");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EvenementIndesirable",
                table: "EvenementIndesirable");

            migrationBuilder.RenameTable(
                name: "FamillesEvenementsIndesirables",
                newName: "FamillesEvenements");

            migrationBuilder.RenameTable(
                name: "EvenementIndesirable",
                newName: "Evenements");

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

            migrationBuilder.AlterColumn<string>(
                name: "Tel",
                table: "Utilisateurs",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<string>(
                name: "Fonction",
                table: "Utilisateurs",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AddPrimaryKey(
                name: "PK_FamillesEvenements",
                table: "FamillesEvenements",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Evenements",
                table: "Evenements",
                column: "Id");

            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEDBM90hUxvw4ElMLu0iV/H7FqtZl+dyqCXTYDsQrJsGlenbMi0zRl59K5SvWktY4PQ==");

            migrationBuilder.AddForeignKey(
                name: "FK_ActionsCorrectives_Evenements_EvenementIndesirableId",
                table: "ActionsCorrectives",
                column: "EvenementIndesirableId",
                principalTable: "Evenements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Evenements_FamillesEvenements_FamilleEvenementIndesirableId",
                table: "Evenements",
                column: "FamilleEvenementIndesirableId",
                principalTable: "FamillesEvenements",
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActionsCorrectives_Evenements_EvenementIndesirableId",
                table: "ActionsCorrectives");

            migrationBuilder.DropForeignKey(
                name: "FK_Evenements_FamillesEvenements_FamilleEvenementIndesirableId",
                table: "Evenements");

            migrationBuilder.DropForeignKey(
                name: "FK_Evenements_Services_ServiceId",
                table: "Evenements");

            migrationBuilder.DropForeignKey(
                name: "FK_Evenements_Utilisateurs_DeclarantId",
                table: "Evenements");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FamillesEvenements",
                table: "FamillesEvenements");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Evenements",
                table: "Evenements");

            migrationBuilder.RenameTable(
                name: "FamillesEvenements",
                newName: "FamillesEvenementsIndesirables");

            migrationBuilder.RenameTable(
                name: "Evenements",
                newName: "EvenementIndesirable");

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

            migrationBuilder.AlterColumn<string>(
                name: "Tel",
                table: "Utilisateurs",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Fonction",
                table: "Utilisateurs",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_FamillesEvenementsIndesirables",
                table: "FamillesEvenementsIndesirables",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EvenementIndesirable",
                table: "EvenementIndesirable",
                column: "Id");

            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEEx+TyFqaFRJFdy4pVDO7fJxmVtfF/0q4L+lPoOZzNeWN97ul5/R3dQU1OU49acBAw==");

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
    }
}
