using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DEI.Migrations
{
    /// <inheritdoc />
    public partial class AddFournisseurToEvenement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Fournisseur",
                table: "Evenements",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "FournisseurPrecision",
                table: "Evenements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEBH+UewwCw1T2YAER1Bk/PfUYtUzMOb054H0AYaV+s4gUJD33/tRp5yaqtDxPEeH6A==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Fournisseur",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "FournisseurPrecision",
                table: "Evenements");

            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEDBM90hUxvw4ElMLu0iV/H7FqtZl+dyqCXTYDsQrJsGlenbMi0zRl59K5SvWktY4PQ==");
        }
    }
}
