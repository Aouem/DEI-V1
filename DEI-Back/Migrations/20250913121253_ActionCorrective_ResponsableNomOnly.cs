using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DEI.Migrations
{
    /// <inheritdoc />
    public partial class ActionCorrective_ResponsableNomOnly : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActionsCorrectives_Utilisateurs_ResponsableId",
                table: "ActionsCorrectives");

            migrationBuilder.RenameColumn(
                name: "ResponsableId",
                table: "ActionsCorrectives",
                newName: "UtilisateurId");

            migrationBuilder.RenameIndex(
                name: "IX_ActionsCorrectives_ResponsableId",
                table: "ActionsCorrectives",
                newName: "IX_ActionsCorrectives_UtilisateurId");

            migrationBuilder.AlterColumn<string>(
                name: "ResponsableNom",
                table: "ActionsCorrectives",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEE7xLVR6Nh92KwEwmRESNX0fG1EEiDJAGWHGLFDSDs8VW9T/zeb5wEVAJjnbRB9zwg==");

            migrationBuilder.AddForeignKey(
                name: "FK_ActionsCorrectives_Utilisateurs_UtilisateurId",
                table: "ActionsCorrectives",
                column: "UtilisateurId",
                principalTable: "Utilisateurs",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActionsCorrectives_Utilisateurs_UtilisateurId",
                table: "ActionsCorrectives");

            migrationBuilder.RenameColumn(
                name: "UtilisateurId",
                table: "ActionsCorrectives",
                newName: "ResponsableId");

            migrationBuilder.RenameIndex(
                name: "IX_ActionsCorrectives_UtilisateurId",
                table: "ActionsCorrectives",
                newName: "IX_ActionsCorrectives_ResponsableId");

            migrationBuilder.AlterColumn<string>(
                name: "ResponsableNom",
                table: "ActionsCorrectives",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEPAbf+YTLU2+i74YhPqYXDsroKbU6ay1siwnZnyatyhaezzJwTDm7Vp7OWjHc7/thg==");

            migrationBuilder.AddForeignKey(
                name: "FK_ActionsCorrectives_Utilisateurs_ResponsableId",
                table: "ActionsCorrectives",
                column: "ResponsableId",
                principalTable: "Utilisateurs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
